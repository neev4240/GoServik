import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { User, ProfessionalProfile, Booking, Review, ServiceCategory } from "../types";

export const firebaseConfig = {
  apiKey: "AIzaSyCSST9EHRk57-MERnU-i9A5a8anZtXgRqQ",
  authDomain: "goservik.firebaseapp.com",
  projectId: "goservik",
  storageBucket: "goservik.firebasestorage.app",
  messagingSenderId: "1083463283410",
  appId: "1:1083463283410:web:2382534fd1660af3c0330b",
  measurementId: "G-JTGBWWL83R"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Firestore Collections: profiles, customers, professionals, bookings, reviews, categories
export const firebaseDb = {
  // Profiles (universal lookup by ID, UID, mobile or email)
  async saveProfile(user: User | ProfessionalProfile): Promise<void> {
    try {
      const docRef = doc(firestore, "profiles", user.id);
      await setDoc(docRef, { ...user, updatedAt: new Date().toISOString() }, { merge: true });
      // Also write to role-specific collection for backwards compatibility
      if (user.role === "professional") {
        await setDoc(doc(firestore, "professionals", user.id), { ...user, updatedAt: new Date().toISOString() }, { merge: true });
      } else {
        await setDoc(doc(firestore, "customers", user.id), { ...user, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (err) {
      console.warn("Firebase saveProfile warning:", err);
    }
  },

  async getProfile(id: string): Promise<User | ProfessionalProfile | null> {
    try {
      const docRef = doc(firestore, "profiles", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as User | ProfessionalProfile;
      }
      // Check customers
      const custSnap = await getDoc(doc(firestore, "customers", id));
      if (custSnap.exists()) return custSnap.data() as User;
      // Check professionals
      const proSnap = await getDoc(doc(firestore, "professionals", id));
      if (proSnap.exists()) return proSnap.data() as ProfessionalProfile;
      return null;
    } catch (err) {
      console.warn("Firebase getProfile error:", err);
      return null;
    }
  },

  async getAllProfiles(): Promise<(User | ProfessionalProfile)[]> {
    try {
      const snap = await getDocs(collection(firestore, "profiles"));
      return snap.docs.map(d => d.data() as (User | ProfessionalProfile));
    } catch (err) {
      console.warn("Firebase getAllProfiles error:", err);
      return [];
    }
  },

  // Bookings
  async saveBooking(booking: Booking): Promise<void> {
    try {
      const docRef = doc(firestore, "bookings", booking.id);
      await setDoc(docRef, { ...booking, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn("Firebase saveBooking warning:", err);
    }
  },

  async getAllBookings(): Promise<Booking[]> {
    try {
      const snap = await getDocs(collection(firestore, "bookings"));
      return snap.docs.map(d => d.data() as Booking);
    } catch (err) {
      console.warn("Firebase getAllBookings warning:", err);
      return [];
    }
  },

  // Reviews
  async saveReview(review: Review): Promise<void> {
    try {
      const docRef = doc(firestore, "reviews", review.id);
      await setDoc(docRef, { ...review, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn("Firebase saveReview warning:", err);
    }
  },

  async getAllReviews(): Promise<Review[]> {
    try {
      const snap = await getDocs(collection(firestore, "reviews"));
      return snap.docs.map(d => d.data() as Review);
    } catch (err) {
      console.warn("Firebase getAllReviews warning:", err);
      return [];
    }
  },

  // Professionals
  async getAllProfessionals(): Promise<ProfessionalProfile[]> {
    try {
      const snap = await getDocs(collection(firestore, "professionals"));
      return snap.docs.map(d => d.data() as ProfessionalProfile);
    } catch (err) {
      console.warn("Firebase getAllProfessionals warning:", err);
      return [];
    }
  },

  // Customers
  async getAllCustomers(): Promise<User[]> {
    try {
      const snap = await getDocs(collection(firestore, "customers"));
      return snap.docs.map(d => d.data() as User);
    } catch (err) {
      console.warn("Firebase getAllCustomers warning:", err);
      return [];
    }
  },

  // Categories
  async saveCategory(cat: ServiceCategory): Promise<void> {
    try {
      const docRef = doc(firestore, "categories", cat.id);
      await setDoc(docRef, cat, { merge: true });
    } catch (err) {
      console.warn("Firebase saveCategory warning:", err);
    }
  },

  async getAllCategories(): Promise<ServiceCategory[]> {
    try {
      const snap = await getDocs(collection(firestore, "categories"));
      return snap.docs.map(d => d.data() as ServiceCategory);
    } catch (err) {
      console.warn("Firebase getAllCategories warning:", err);
      return [];
    }
  },

  async deleteProfile(id: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, "profiles", id));
      await deleteDoc(doc(firestore, "customers", id));
      await deleteDoc(doc(firestore, "professionals", id));
    } catch (err) {
      console.warn("Firebase deleteProfile warning:", err);
    }
  },

  async deleteBooking(id: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, "bookings", id));
    } catch (err) {
      console.warn("Firebase deleteBooking warning:", err);
    }
  }
};
