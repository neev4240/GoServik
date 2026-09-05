import { ProfessionalProfile } from '../types';
import { KAAMNOW_CATEGORIES } from './categories';

// Real Delhi NCR Coordinates
const NCR_LOCATIONS = [
  { location: 'South Delhi (Saket & Hauz Khas)', coords: { lat: 28.5244, lng: 77.2066 } },
  { location: 'Central Delhi (CP & Karol Bagh)', coords: { lat: 28.6304, lng: 77.2177 } },
  { location: 'Noida (Sector 18 & 62)', coords: { lat: 28.5708, lng: 77.3271 } },
  { location: 'Gurgaon (Cyber City & DLF)', coords: { lat: 28.4900, lng: 77.0888 } },
  { location: 'West Delhi (Janakpuri & Rajouri)', coords: { lat: 28.6219, lng: 77.0878 } },
  { location: 'East Delhi (Laxmi Nagar & Mayur Vihar)', coords: { lat: 28.6139, lng: 77.2988 } },
  { location: 'North Delhi (Rohini & Pitampura)', coords: { lat: 28.7041, lng: 77.1025 } },
  { location: 'Ghaziabad (Indirapuram & Vaishali)', coords: { lat: 28.6415, lng: 77.3714 } },
  { location: 'Faridabad (Sector 15 & NIT)', coords: { lat: 28.4089, lng: 77.3178 } },
  { location: 'Dwarka (Sector 10 & 21)', coords: { lat: 28.5823, lng: 77.0500 } },
];

const AVATARS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
];

interface ProDefinition {
  name: string;
  tagline: string;
  bio: string;
  hourlyRate: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
}

const CATEGORY_PRO_DATA: Record<string, ProDefinition[]> = {
  'cat-electrical': [
    { name: 'Rajesh Sharma', tagline: 'Master Wireman & Inverter Specialist', bio: 'Over 8 years handling complex household wiring, MCB tripping issues, and 3-phase setups.', hourlyRate: 350, experienceYears: 8, rating: 4.9, reviewCount: 68, jobsCompleted: 184 },
    { name: 'Amit Verma', tagline: 'Industrial & Domestic Certified Electrician', bio: 'Licensed electrical engineer handling short circuits, surge protectors, and decorative lighting.', hourlyRate: 380, experienceYears: 9, rating: 4.85, reviewCount: 52, jobsCompleted: 142 },
    { name: 'Sandeep Chauhan', tagline: 'Senior Electrical Tech & EV Setup', bio: 'Punctual specialist for EV home chargers, heavy load distribution boards, and fan fittings.', hourlyRate: 320, experienceYears: 6, rating: 4.8, reviewCount: 41, jobsCompleted: 110 },
    { name: 'Naveen Rao', tagline: 'Lighting & MCB Fault Diagnosis Expert', bio: 'Specialist in pinpointing hidden conduit faults, chandelier mounting, and emergency tripping.', hourlyRate: 360, experienceYears: 7, rating: 4.92, reviewCount: 77, jobsCompleted: 198 },
    { name: 'Rakesh Pandey', tagline: 'Smart Switchboard & Appliance Power Tech', bio: 'Expert in automation wiring, modular plates, inverter batteries, and voltage stabilization.', hourlyRate: 340, experienceYears: 5, rating: 4.78, reviewCount: 36, jobsCompleted: 95 }
  ],
  'cat-plumbing': [
    { name: 'Manoj Kumar', tagline: 'Master Sanitary & Leakage Specialist', bio: '10 years experience resolving high-pressure line bursts, concealed pipe leaks, and tap fitting.', hourlyRate: 350, experienceYears: 10, rating: 4.92, reviewCount: 84, jobsCompleted: 220 },
    { name: 'Sunil Prasad', tagline: 'Water Tank & Geyser Plumber', bio: 'Specialist in overhead water tank piping, pressure pump calibration, and geyser inlet valves.', hourlyRate: 320, experienceYears: 7, rating: 4.82, reviewCount: 49, jobsCompleted: 135 },
    { name: 'Dinesh Yadav', tagline: 'Bathroom Fittings & Drain Clearer', bio: 'Fast resolution of stubborn drain clogs, toilet flush cisterns, and bathroom shower panels.', hourlyRate: 300, experienceYears: 6, rating: 4.79, reviewCount: 39, jobsCompleted: 102 },
    { name: 'Harish Negi', tagline: 'Commercial & Residential Piping Pro', bio: 'Certified in CPVC, UPVC, and GI piping replacement with clean non-destructive wall work.', hourlyRate: 370, experienceYears: 9, rating: 4.88, reviewCount: 63, jobsCompleted: 175 },
    { name: 'Vinod Tiwari', tagline: 'Acoustic Leak Detection & Repair Expert', bio: 'Pinpoint acoustic detection of hidden underground and concealed wall seepages.', hourlyRate: 390, experienceYears: 8, rating: 4.95, reviewCount: 91, jobsCompleted: 240 }
  ],
  'cat-carpentry': [
    { name: 'Gurpreet Singh', tagline: 'Master Carpenter & Modular Woodwork', bio: 'Specialized in modular wardrobes, hydraulic bed assemblies, and premium teak door fitting.', hourlyRate: 380, experienceYears: 11, rating: 4.94, reviewCount: 88, jobsCompleted: 215 },
    { name: 'Jagdish Mistry', tagline: 'Wardrobe & Kitchen Woodwork Craftsman', bio: 'Fine finish carpentry, soft-close cabinet adjustments, and customized wood shelving.', hourlyRate: 350, experienceYears: 8, rating: 4.86, reviewCount: 57, jobsCompleted: 148 },
    { name: 'Ramesh Panchal', tagline: 'Door Lock, Hinge & Furniture Assembly', bio: 'Quick fix for sagging doors, antique furniture repair, and flat-pack assembly.', hourlyRate: 300, experienceYears: 7, rating: 4.81, reviewCount: 44, jobsCompleted: 118 },
    { name: 'Arvind Suthar', tagline: 'Custom Furniture & Hardwood Restorer', bio: 'Wood polishing, laminate re-pasting, drawer slider repairs, and wooden partitions.', hourlyRate: 360, experienceYears: 9, rating: 4.9, reviewCount: 65, jobsCompleted: 169 },
    { name: 'Balwan Singh', tagline: 'Modular Cabinets & Locking Specialist', bio: 'Expert in multi-point security locks, sliding wardrobe rollers, and computer desks.', hourlyRate: 340, experienceYears: 6, rating: 4.77, reviewCount: 38, jobsCompleted: 98 }
  ],
  'cat-masonry': [
    { name: 'Ram Lakhan', tagline: 'Senior Civil Mason & Brickwork Expert', bio: 'Experienced contractor for boundary walls, wall crack structural repair, and plastering.', hourlyRate: 320, experienceYears: 12, rating: 4.88, reviewCount: 64, jobsCompleted: 170 },
    { name: 'Shiv Kumar', tagline: 'Plastering & Floor Repair Specialist', bio: 'Smooth wall plastering, cement screed leveling, and concrete crack filling.', hourlyRate: 300, experienceYears: 8, rating: 4.82, reviewCount: 48, jobsCompleted: 125 },
    { name: 'Kailash Chand', tagline: 'Boundary Walls & Structural Mason', bio: 'Staircase civil repair, parapet wall rebuilding, and strong foundation bonding.', hourlyRate: 340, experienceYears: 10, rating: 4.85, reviewCount: 56, jobsCompleted: 145 },
    { name: 'Bhola Ram', tagline: 'RCC & Pillar Reinforcement Specialist', bio: 'Rust proofing rebar, lintel beam fixes, and damp-resistant civil mortar work.', hourlyRate: 360, experienceYears: 11, rating: 4.9, reviewCount: 71, jobsCompleted: 190 },
    { name: 'Mohan Lal', tagline: 'Civil Mason & Tile Base Preparation', bio: 'Subfloor preparation, balcony waterproofing bases, and neat brickwork finishes.', hourlyRate: 290, experienceYears: 7, rating: 4.76, reviewCount: 35, jobsCompleted: 92 }
  ],
  'cat-painting': [
    { name: 'Vijay Kumar', tagline: 'Royal Luxury Painter & Texture Artist', bio: 'Master of velvet finish paints, metallic wall stencils, and waterproof exterior coats.', hourlyRate: 320, experienceYears: 9, rating: 4.93, reviewCount: 82, jobsCompleted: 210 },
    { name: 'Sanjay Maurya', tagline: 'Interior & Exterior Paint Specialist', bio: 'Clean dustless sanding, primer coats, anti-fungal treatments, and high-gloss enamels.', hourlyRate: 300, experienceYears: 7, rating: 4.84, reviewCount: 51, jobsCompleted: 130 },
    { name: 'Pramod Shukla', tagline: 'Waterproofing & Wall Touch-up Expert', bio: 'Expert in curing paint peeling, efflorescence treatment, and rapid color matching.', hourlyRate: 310, experienceYears: 8, rating: 4.87, reviewCount: 60, jobsCompleted: 155 },
    { name: 'Arjun Das', tagline: 'Designer Wallpaper & Stencil Painter', bio: 'Precision wallpaper seamless alignment, wood polish, and interior theme painting.', hourlyRate: 350, experienceYears: 6, rating: 4.89, reviewCount: 47, jobsCompleted: 119 },
    { name: 'Naresh Kashyap', tagline: 'Duco Polish & Weather-coat Expert', bio: 'Exterior weather defense paint coats, door spray polishing, and terrace heat reflection.', hourlyRate: 330, experienceYears: 10, rating: 4.91, reviewCount: 75, jobsCompleted: 185 }
  ],
  'cat-flooring': [
    { name: 'Rajendra Prasad', tagline: 'Italian Marble & Granite Polisher', bio: 'Diamond pad marble grinding, mirror crystallization polish, and seamless joint filling.', hourlyRate: 380, experienceYears: 12, rating: 4.95, reviewCount: 94, jobsCompleted: 245 },
    { name: 'Subhash Chandra', tagline: 'Vitrified & Ceramic Tile Mason', bio: 'Laser-level tile alignment, large format slab installation, and hollow tile repair.', hourlyRate: 340, experienceYears: 8, rating: 4.86, reviewCount: 58, jobsCompleted: 152 },
    { name: 'Ashok Rawat', tagline: 'Bathroom & Kitchen Tiling Specialist', bio: 'Anti-skid flooring, mosaic designs, and slope correction for smooth drainage.', hourlyRate: 320, experienceYears: 7, rating: 4.81, reviewCount: 43, jobsCompleted: 115 },
    { name: 'Mahesh Goswami', tagline: 'Epoxy Grouting & Marble Grinding', bio: 'Stain-free epoxy grout application, stone border inlays, and granite counter edge chamfering.', hourlyRate: 360, experienceYears: 9, rating: 4.89, reviewCount: 66, jobsCompleted: 172 },
    { name: 'Surender Pal', tagline: 'Wooden & Vinyl Flooring Specialist', bio: 'Interlocking vinyl planks, engineered wood laying, and sound-dampening underlays.', hourlyRate: 350, experienceYears: 6, rating: 4.79, reviewCount: 37, jobsCompleted: 96 }
  ],
  'cat-aluminium-glass': [
    { name: 'Imran Khan', tagline: 'UPVC & Sliding Window Fabricator', bio: 'Double glazed soundproof UPVC windows, heavy duty sliding tracks, and roller repair.', hourlyRate: 340, experienceYears: 8, rating: 4.9, reviewCount: 63, jobsCompleted: 165 },
    { name: 'Tariq Ali', tagline: 'Toughened Glass & Partition Expert', bio: 'Shower cubicles, frameless glass doors, frosted office dividers, and spider fittings.', hourlyRate: 390, experienceYears: 10, rating: 4.93, reviewCount: 79, jobsCompleted: 205 },
    { name: 'Jitendra Soni', tagline: 'Aluminium Door & Window Specialist', bio: 'Anodized aluminium sections, casement latches, and custom weather-strip sealing.', hourlyRate: 320, experienceYears: 7, rating: 4.83, reviewCount: 46, jobsCompleted: 122 },
    { name: 'Mohd. Aslam', tagline: 'Mosquito Mesh & Balcony Glass Enclosures', bio: 'Pleated sliding mosquito nets, stainless steel mesh, and balcony glass wind barriers.', hourlyRate: 300, experienceYears: 6, rating: 4.8, reviewCount: 39, jobsCompleted: 104 },
    { name: 'Rahul Bhati', tagline: 'Soundproof UPVC & Structural Glazing', bio: 'Acoustic glass retrofitting, thermal insulation gaskets, and patch-fitting doors.', hourlyRate: 370, experienceYears: 9, rating: 4.88, reviewCount: 58, jobsCompleted: 150 }
  ],
  'cat-appliances': [
    { name: 'Deepak Saxena', tagline: 'Inverter AC & Refrigeration Engineer', bio: 'Gas charging, inverter PCB troubleshooting, leak test, and cooling coil replacement.', hourlyRate: 400, experienceYears: 10, rating: 4.94, reviewCount: 92, jobsCompleted: 250 },
    { name: 'Manish Joshi', tagline: 'Washing Machine & Microwave Specialist', bio: 'Front & top load drum balancing, motor capacitor repair, and heating element fixes.', hourlyRate: 350, experienceYears: 8, rating: 4.86, reviewCount: 61, jobsCompleted: 160 },
    { name: 'Nitin Bhatia', tagline: 'RO Water Purifier & Chimney Tech', bio: 'Membrane replacement, TDS balance, auto-clean chimney degreasing, and suction fans.', hourlyRate: 320, experienceYears: 6, rating: 4.82, reviewCount: 45, jobsCompleted: 120 },
    { name: 'Vikas Malviya', tagline: 'Multi-brand HVAC & Geyser Technician', bio: 'Instant & storage geyser thermostat replacement, AC installation, and duct servicing.', hourlyRate: 370, experienceYears: 9, rating: 4.89, reviewCount: 70, jobsCompleted: 185 },
    { name: 'Gaurav Dubey', tagline: 'Smart Appliance & Circuit Repair Specialist', bio: 'Microcontroller diagnostics, refrigerator defrost sensors, and dishwasher repairs.', hourlyRate: 360, experienceYears: 7, rating: 4.79, reviewCount: 40, jobsCompleted: 105 }
  ],
  'cat-cleaning': [
    { name: 'Priya Verma', tagline: 'Deep Home Cleaning & Sanitization Lead', bio: 'Hospital-grade sanitization, full villa deep clean, eco-safe enzyme cleaners.', hourlyRate: 400, experienceYears: 7, rating: 4.95, reviewCount: 89, jobsCompleted: 230 },
    { name: 'Pooja Shrivastav', tagline: 'Eco-Friendly Residential Cleaning Pro', bio: 'Pet-safe cleaning solutions, tile scrubbers, balcony pressure washing, and upholstery care.', hourlyRate: 350, experienceYears: 6, rating: 4.88, reviewCount: 55, jobsCompleted: 145 },
    { name: 'Kavita Rathore', tagline: 'Sofa & Carpet Shampoo Specialist', bio: 'Injection-extraction fabric vacuuming, leather polishing, and mattress mite sterilization.', hourlyRate: 360, experienceYears: 5, rating: 4.84, reviewCount: 43, jobsCompleted: 112 },
    { name: 'Anjali Kumari', tagline: 'Kitchen Degreasing & Bathroom Sanitizer', bio: 'Heavy oil stain stripping, exhaust cleaning, limescale removal, and grout whitening.', hourlyRate: 330, experienceYears: 6, rating: 4.82, reviewCount: 48, jobsCompleted: 128 },
    { name: 'Sunita Devi', tagline: 'Water Tank & Post-Construction Cleaner', bio: 'UV tank sterilization, sludge extraction, paint splatter removal, and window pane washing.', hourlyRate: 320, experienceYears: 8, rating: 4.9, reviewCount: 67, jobsCompleted: 175 }
  ],
  'cat-waterproofing': [
    { name: 'Hemant Rawat', tagline: 'Terrace & Roof Waterproofing Specialist', bio: 'Elastomeric PU coating, torch-on bitumen membranes, and rainwater slope corrections.', hourlyRate: 390, experienceYears: 11, rating: 4.93, reviewCount: 86, jobsCompleted: 225 },
    { name: 'Satish Upadhyay', tagline: 'Basement Leakage & Injection Grouting', bio: 'High-pressure polyurethane injection, negative side waterproofing, and sump pit sealing.', hourlyRate: 420, experienceYears: 12, rating: 4.91, reviewCount: 78, jobsCompleted: 195 },
    { name: 'Pradeep Sen', tagline: 'Heatproof & Polymer Membrane Applicator', bio: 'Solar reflective cool roof coatings reducing terrace heat by up to 8°C.', hourlyRate: 350, experienceYears: 8, rating: 4.85, reviewCount: 52, jobsCompleted: 138 },
    { name: 'Ravindra Negi', tagline: 'Exterior Wall Crack Sealer & Inspector', bio: 'Rope-access building facade sealing, window perimeter caulk, and expansion joints.', hourlyRate: 370, experienceYears: 9, rating: 4.88, reviewCount: 64, jobsCompleted: 168 },
    { name: 'Dharmendra Yadav', tagline: 'Chemical Waterproofing & Roof Restorer', bio: 'Fiber mesh reinforced waterproofing coats with 5-year anti-leakage guarantee.', hourlyRate: 340, experienceYears: 7, rating: 4.8, reviewCount: 41, jobsCompleted: 108 }
  ],
  'cat-interior': [
    { name: 'Rohan Mehra', tagline: 'Modular Kitchen & Wardrobe Designer', bio: '3D layout optimization, acrylic/laminate shutters, and premium pull-out hardware.', hourlyRate: 450, experienceYears: 9, rating: 4.94, reviewCount: 80, jobsCompleted: 210 },
    { name: 'Shalini Kapoor', tagline: 'False Ceiling & Ambient Lighting Pro', bio: 'Gypsum board cove lighting, acoustic ceilings, and minimalist residential aesthetics.', hourlyRate: 420, experienceYears: 8, rating: 4.91, reviewCount: 65, jobsCompleted: 170 },
    { name: 'Neeraj Singhal', tagline: 'TV Unit & Custom Storage Specialist', bio: 'Floating media consoles, concealed wire management, and space-saving study units.', hourlyRate: 380, experienceYears: 7, rating: 4.86, reviewCount: 50, jobsCompleted: 132 },
    { name: 'Vikram Anand', tagline: 'Turnkey Residential Interior Craftsman', bio: 'Coordinating carpentry, electrical, and civil finishes for complete room renovations.', hourlyRate: 480, experienceYears: 11, rating: 4.96, reviewCount: 95, jobsCompleted: 240 },
    { name: 'Tanvi Malhotra', tagline: 'Office & Modular Space Optimizer', bio: 'Ergonomic workstations, glass partitions, and acoustic wall paneling.', hourlyRate: 400, experienceYears: 6, rating: 4.82, reviewCount: 42, jobsCompleted: 110 }
  ],
  'cat-smarthome': [
    { name: 'Varun Kapoor', tagline: 'CCTV Security & Video Doorbell Engineer', bio: 'IP camera NVR networks, motion detection alerts, remote phone streaming, and PTZ cams.', hourlyRate: 420, experienceYears: 8, rating: 4.94, reviewCount: 85, jobsCompleted: 220 },
    { name: 'Abhishek Goel', tagline: 'Smart Door Locks & Home Automation Tech', bio: 'Biometric fingerprint locks, Zigbee/Z-Wave hubs, and smart curtain motors.', hourlyRate: 450, experienceYears: 7, rating: 4.9, reviewCount: 62, jobsCompleted: 160 },
    { name: 'Nikhil Sethi', tagline: 'Mesh Wi-Fi & Gigabit Ethernet Installer', bio: 'Eliminating dead zones with seamless mesh Wi-Fi 6 nodes and CAT6 cabling.', hourlyRate: 360, experienceYears: 6, rating: 4.85, reviewCount: 48, jobsCompleted: 125 },
    { name: 'Rohit Talwar', tagline: 'Burglar Alarm & Security Sensor Pro', bio: 'Door contact sensors, glass break detectors, outdoor laser tripwires, and sirens.', hourlyRate: 390, experienceYears: 8, rating: 4.88, reviewCount: 56, jobsCompleted: 145 },
    { name: 'Saurabh Jain', tagline: 'IoT Smart Lighting & Intercom Specialist', bio: 'Multi-apartment video intercoms, smart dimmer modules, and voice assistant syncing.', hourlyRate: 380, experienceYears: 5, rating: 4.81, reviewCount: 38, jobsCompleted: 98 }
  ],
  'cat-construction': [
    { name: 'Er. Anoop Mittal', tagline: 'Structural Civil Engineer & Contractor', bio: 'RCC design compliance, column casting, floor additions, and load-bearing inspection.', hourlyRate: 550, experienceYears: 14, rating: 4.96, reviewCount: 105, jobsCompleted: 260 },
    { name: 'Kamal Kishore', tagline: 'Room Extension & Renovation Supervisor', bio: 'Veranda enclosures, extra bedroom additions, and seamless plumbing/civil integration.', hourlyRate: 480, experienceYears: 11, rating: 4.9, reviewCount: 76, jobsCompleted: 195 },
    { name: 'Balraj Tyagi', tagline: 'Demolition & Civil Remodeling Contractor', bio: 'Safe wall knock-downs, lintel reinforcement, rubble carting, and site leveling.', hourlyRate: 440, experienceYears: 9, rating: 4.84, reviewCount: 54, jobsCompleted: 140 },
    { name: 'Devendra Arya', tagline: 'Residential Building Construction Pro', bio: 'Ground-up construction supervision, curing protocols, and anti-termite soil treatment.', hourlyRate: 500, experienceYears: 12, rating: 4.92, reviewCount: 88, jobsCompleted: 225 },
    { name: 'Pankaj Goyal', tagline: 'Structural Repair & RCC Contractor', bio: 'Spalled concrete restoration, carbon fiber wrapping, and foundation underpinning.', hourlyRate: 460, experienceYears: 10, rating: 4.87, reviewCount: 63, jobsCompleted: 162 }
  ],
  'cat-outdoor': [
    { name: 'Gopal Singh', tagline: 'Landscape Gardener & Lawn Care Expert', bio: 'Organic soil enrichment, lawn turfing, ornamental hedges, and pest treatment.', hourlyRate: 320, experienceYears: 9, rating: 4.91, reviewCount: 72, jobsCompleted: 185 },
    { name: 'Kishan Swaroop', tagline: 'Automatic Drip Irrigation & Exterior Tech', bio: 'Water timer solenoids, micro-sprinklers for balconies, and rainwater harvesting pipes.', hourlyRate: 350, experienceYears: 7, rating: 4.85, reviewCount: 50, jobsCompleted: 130 },
    { name: 'Jagmohan Negi', tagline: 'Paver Block & Driveway Paving Specialist', bio: 'Interlocking concrete pavers, driveway slope drainage, and gravel pathways.', hourlyRate: 330, experienceYears: 8, rating: 4.87, reviewCount: 59, jobsCompleted: 152 },
    { name: 'Surendra Rana', tagline: 'Boundary Fencing & Garden Gate Craftsman', bio: 'Chainlink fencing, PVC coated mesh, decorative wooden trellis, and exterior gates.', hourlyRate: 340, experienceYears: 6, rating: 4.82, reviewCount: 44, jobsCompleted: 115 },
    { name: 'Madan Lal', tagline: 'Outdoor Masonry & Tree Pruning Specialist', bio: 'Planter boxes, stone waterfall fountains, and professional tree branch trimming.', hourlyRate: 300, experienceYears: 10, rating: 4.88, reviewCount: 68, jobsCompleted: 175 }
  ],
  'cat-fabrication': [
    { name: 'Mohd. Rizwan', tagline: 'Steel Gate & Safety Grill Fabricator', bio: 'Custom sliding main gates, balcony safety grills, laser-cut CNC panels, and heavy hinges.', hourlyRate: 360, experienceYears: 10, rating: 4.93, reviewCount: 83, jobsCompleted: 215 },
    { name: 'Gurmukh Singh', tagline: 'Stainless Steel Railing & Balcony Specialist', bio: 'Grade 304 SS handrails, glass railing brackets, and argon arc mirror polish.', hourlyRate: 390, experienceYears: 9, rating: 4.9, reviewCount: 67, jobsCompleted: 172 },
    { name: 'Chandresh Pal', tagline: 'Heavy Shed Fabrication & Arc Welder', bio: 'Terrace polycarbonate sheds, factory steel trusses, and structural beam welding.', hourlyRate: 370, experienceYears: 11, rating: 4.88, reviewCount: 74, jobsCompleted: 190 },
    { name: 'Afzal Hussain', tagline: 'Spiral Staircase & Metal Structure Craftsman', bio: 'Compact spiral iron stairs, mezzanine metal platforms, and emergency escape stairs.', hourlyRate: 380, experienceYears: 8, rating: 4.86, reviewCount: 53, jobsCompleted: 138 },
    { name: 'Shyam Sundar', tagline: 'Wrought Iron Designer & Repair Welder', bio: 'Artistic iron window grates, on-site broken hinge welding, and anti-rust coatings.', hourlyRate: 330, experienceYears: 7, rating: 4.81, reviewCount: 46, jobsCompleted: 118 }
  ],
  'cat-inspection': [
    { name: 'Er. Alok Vashisth', tagline: 'Certified Home Snagging & Quality Auditor', bio: 'Comprehensive 150+ point structural, plumbing, and thermal inspection before handover.', hourlyRate: 500, experienceYears: 13, rating: 4.97, reviewCount: 110, jobsCompleted: 280 },
    { name: 'Commander R.K. Bhargava', tagline: 'Electrical & Plumbing Safety Auditor', bio: 'Earthing resistance tests, pipeline pressure gauge checks, and fire safety compliance.', hourlyRate: 480, experienceYears: 15, rating: 4.94, reviewCount: 95, jobsCompleted: 245 },
    { name: 'Tarun Aggarwal', tagline: 'Pre-Purchase Property & Structural Auditor', bio: 'Checking dampness with moisture meters, tilt/deflection checks, and snagging reports.', hourlyRate: 450, experienceYears: 10, rating: 4.89, reviewCount: 68, jobsCompleted: 175 },
    { name: 'Suraj Bhan', tagline: 'Preventive Home Maintenance Specialist', bio: 'Routine seasonal checkups covering all trades to prevent emergency breakdowns.', hourlyRate: 380, experienceYears: 8, rating: 4.85, reviewCount: 55, jobsCompleted: 142 },
    { name: 'Hemant Chawla', tagline: 'Multi-point Handyman & Quality Inspector', bio: 'Diagnosing odd noises, drainage traps, door balances, and roof health evaluations.', hourlyRate: 400, experienceYears: 7, rating: 4.82, reviewCount: 47, jobsCompleted: 120 }
  ]
};

export function generateAll80DemoProfessionals(): ProfessionalProfile[] {
  const allPros: ProfessionalProfile[] = [];
  let globalIndex = 0;

  for (const cat of KAAMNOW_CATEGORIES) {
    const definitions = CATEGORY_PRO_DATA[cat.id] || [];
    
    definitions.forEach((def, i) => {
      const locObj = NCR_LOCATIONS[(globalIndex + i * 2) % NCR_LOCATIONS.length];
      const avatarUrl = AVATARS[(globalIndex + i) % AVATARS.length];
      const proId = `pro-${cat.id.replace('cat-', '')}-${i + 1}`;

      const fullSubcats = cat.subcategories;
      const primarySubcats = fullSubcats.slice(i * 2, (i + 1) * 2 + 2);
      const subcatsToAssign = primarySubcats.length > 0 ? primarySubcats : fullSubcats.slice(0, 3);

      const pro: ProfessionalProfile = {
        id: proId,
        uid: `uid-${proId}`,
        name: def.name,
        personalName: `${def.name} (${def.tagline})`,
        email: `${def.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@kaamnow.com`,
        mobile: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
        role: 'professional',
        joinedAt: new Date(Date.now() - (globalIndex + 10) * 86400000 * 3).toISOString(),
        avatar: avatarUrl,
        verified: true,
        tagline: def.tagline,
        bio: def.bio,
        location: locObj.location,
        serviceRadiusKm: 20 + (i % 3) * 5, // 20 - 30 km
        coordinates: locObj.coords,
        languages: ['Hindi', 'English', (i % 2 === 0 ? 'Punjabi' : 'Haryanvi')],
        skills: [
          {
            categoryId: cat.id,
            categoryName: cat.name,
            subcategories: subcatsToAssign
          }
        ],
        services: [
          {
            id: `srv-${proId}-1`,
            categoryId: cat.id,
            name: `${cat.name} Service & Diagnosis`,
            description: def.bio,
            basePrice: def.hourlyRate,
            priceUnit: 'hourly',
            experienceYears: def.experienceYears,
            subcategories: subcatsToAssign
          }
        ],
        hourlyRate: def.hourlyRate,
        fourHourRate: Math.round(def.hourlyRate * 3.4),
        fullDayRate: Math.round(def.hourlyRate * 6.2),
        supportsDiagnosticVisit: true,
        gallery: [],
        certifications: [
          'KaamNow Verified Trade Master',
          'National Skill Development Council (NSDC) Qualified'
        ],
        workingHours: {
          Mon: '08:00 - 20:00',
          Tue: '08:00 - 20:00',
          Wed: '08:00 - 20:00',
          Thu: '08:00 - 20:00',
          Fri: '08:00 - 20:00',
          Sat: '08:00 - 20:00',
          Sun: '09:00 - 18:00'
        },
        responseTime: `${15 + (i * 3)} mins`,
        availabilityStatus: 'available',
        rating: def.rating,
        reviewCount: def.reviewCount,
        jobsCompleted: def.jobsCompleted,
        satisfiesElderSafe: true,
        satisfiesWomenSafe: true,
        subscriptionStatus: 'active_free_tier',
        subscriptionQuarter: 1,
        calculatedMonthlySubscription: 100 + Math.round((5.0 - def.rating) * 100),
        earnedIncentivesTotal: 1000 + def.jobsCompleted * 15
      };

      allPros.push(pro);
      globalIndex++;
    });
  }

  return allPros;
}

export const ALL_DEMO_80_PROFESSIONALS = generateAll80DemoProfessionals();
