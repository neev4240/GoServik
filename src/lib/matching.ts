import { ProfessionalProfile } from '../types';

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface MatchingRequirement {
  categoryId: string;
  subcategories: string[];
  customerCoordinates?: { lat: number; lng: number };
  customerLat?: number;
  customerLng?: number;
  customerCity?: string;
  urgency?: 'normal' | 'urgent' | 'emergency';
  preferElderSafe?: boolean;
  preferWomenSafe?: boolean;
  safetyPreferences?: {
    elderSafe?: boolean;
    womenSafe?: boolean;
  };
}

export interface ScoredProfessional {
  professional: ProfessionalProfile;
  matchScore: number; // 0 - 100
  score: number;
  matchedSubcategories: string[];
  totalRequestedSubcategories: number;
  distanceKm: number | null;
  estimatedArrivalMinutes: number;
  canArriveWithin30Min: boolean;
  skillOverlapCount: number;
  withinServiceRadius: boolean;
  scoreBreakdown: {
    skillsMatchPoints: number;
    distancePoints: number;
    ratingPoints: number;
    experiencePoints: number;
    safetyPoints: number;
  };
}

export function matchProfessionals(
  professionals: ProfessionalProfile[],
  req: MatchingRequirement
): ScoredProfessional[] {
  const scored: ScoredProfessional[] = [];

  for (const pro of professionals) {
    // 1. Check if professional is in available state or verified
    if (pro.availabilityStatus === 'offline') continue;

    // 2. Category and sub-services overlap
    let matchedSubcategories: string[] = [];
    
    // Check in professional's registered skills
    if (pro.skills && pro.skills.length > 0) {
      for (const skillGroup of pro.skills) {
        if (skillGroup.categoryId === req.categoryId) {
          const matched = req.subcategories.filter(sub =>
            skillGroup.subcategories.some(ps => ps.toLowerCase().trim() === sub.toLowerCase().trim())
          );
          matchedSubcategories = Array.from(new Set([...matchedSubcategories, ...matched]));
        }
      }
    }

    // Also check in pro.services if present
    if (pro.services && pro.services.length > 0) {
      for (const srv of pro.services) {
        if (srv.categoryId === req.categoryId && srv.subcategories) {
          const matched = req.subcategories.filter(sub =>
            srv.subcategories.some(ps => ps.toLowerCase().trim() === sub.toLowerCase().trim())
          );
          matchedSubcategories = Array.from(new Set([...matchedSubcategories, ...matched]));
        }
      }
    }

    // Pro must match either the category or at least 1 sub-service, or if no subcategories specified, category match
    const categoryMatched = pro.skills?.some(s => s.categoryId === req.categoryId) ||
      pro.services?.some(s => s.categoryId === req.categoryId);

    if (!categoryMatched && matchedSubcategories.length === 0) {
      continue;
    }

    // Points calculation
    const totalReq = Math.max(req.subcategories.length, 1);
    const overlapRatio = matchedSubcategories.length / totalReq;
    const skillsMatchPoints = Math.round(overlapRatio * 35); // max 35 pts

    // 3. Distance scoring
    let distanceKm: number | null = null;
    let distancePoints = 20; // default medium if no coordinates
    let withinRadius = true;

    if (req.customerCoordinates && pro.coordinates) {
      distanceKm = getDistanceKm(
        req.customerCoordinates.lat,
        req.customerCoordinates.lng,
        pro.coordinates.lat,
        pro.coordinates.lng
      );

      const maxRadius = pro.serviceRadiusKm || 25;
      withinRadius = distanceKm <= maxRadius;

      if (distanceKm <= 5) distancePoints = 25;
      else if (distanceKm <= 10) distancePoints = 22;
      else if (distanceKm <= 20) distancePoints = 18;
      else if (distanceKm <= 35) distancePoints = 12;
      else distancePoints = 5;
    }

    // 4. Rating & Verification scoring (max 20 pts)
    const ratingRatio = (pro.rating || 4.0) / 5.0;
    let ratingPoints = Math.round(ratingRatio * 15);
    if (pro.verified) ratingPoints += 5;

    // 5. Experience & Jobs Completed (max 10 pts)
    const jobs = pro.jobsCompleted || 0;
    let experiencePoints = 5;
    if (jobs > 50) experiencePoints = 10;
    else if (jobs > 10) experiencePoints = 8;

    // 6. Safety & Comfort matching (max 10 pts)
    let safetyPoints = 5;
    if (req.preferElderSafe || req.safetyPreferences?.elderSafe) {
      if (pro.satisfiesElderSafe) safetyPoints += 3;
    }
    if (req.preferWomenSafe || req.safetyPreferences?.womenSafe) {
      if (pro.satisfiesWomenSafe) safetyPoints += 2;
    }

    const matchScore = Math.min(
      100,
      skillsMatchPoints + distancePoints + ratingPoints + experiencePoints + safetyPoints
    );

    // Google Maps & NCR road traffic estimation:
    // Average urban speed ~22 km/h + 5 min dispatch/prep time
    const estimatedArrivalMinutes = distanceKm != null
      ? Math.max(10, Math.round((distanceKm / 22) * 60) + 5)
      : 35; // Default to 35 min if location cannot be computed

    const canArriveWithin30Min = 
      pro.availabilityStatus === 'available' && 
      distanceKm != null && 
      estimatedArrivalMinutes <= 30 &&
      withinRadius;

    scored.push({
      professional: pro,
      matchScore,
      score: matchScore,
      matchedSubcategories,
      totalRequestedSubcategories: req.subcategories.length,
      distanceKm,
      estimatedArrivalMinutes,
      canArriveWithin30Min,
      skillOverlapCount: matchedSubcategories.length,
      withinServiceRadius: withinRadius,
      scoreBreakdown: {
        skillsMatchPoints,
        distancePoints,
        ratingPoints,
        experiencePoints,
        safetyPoints
      }
    });
  }

  // Rank by matchScore descending, then distance ascending
  return scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    if (a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm;
    }
    return (b.professional.rating || 0) - (a.professional.rating || 0);
  });
}

/**
 * Filter professionals strictly eligible for 30-minute urgent dispatch
 */
export function findUrgentProfessionals(
  professionals: ProfessionalProfile[],
  req: MatchingRequirement
): ScoredProfessional[] {
  const allScored = matchProfessionals(professionals, req);
  return allScored.filter(sp => sp.canArriveWithin30Min);
}
