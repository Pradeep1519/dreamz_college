// src/lib/offerService.ts

import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  setDoc
} from 'firebase/firestore';

export interface Offer {
  id?: string;
  name: string;
  description: string;
  type: 'registration_discount' | 'scholarship' | 'referral' | 'festival' | 'early_bird';
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  originalFee: number;
  discountedFee: number;
  locations: string[]; // ['login_popup', 'course_card', 'college_page', 'apply_button', 'hero_banner']
  validFrom: string;
  validTill: string;
  usageLimit: number;
  usedCount: number;
  targetAudience: 'all' | 'new_users' | 'specific_users';
  specificUserIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  code?: string; // Promo code for manual entry
}

// ========== OFFER CRUD OPERATIONS ==========

// Get all offers
export const getAllOffers = async (): Promise<Offer[]> => {
  try {
    const offersRef = collection(db, 'offers');
    const q = query(offersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
};

// Get active offers
export const getActiveOffers = async (): Promise<Offer[]> => {
  try {
    const offersRef = collection(db, 'offers');
    const now = new Date().toISOString().split('T')[0];
    const q = query(
      offersRef,
      where('isActive', '==', true),
      where('validTill', '>=', now),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
  } catch (error) {
    console.error('Error fetching active offers:', error);
    return [];
  }
};

// Get offers by location
export const getOffersByLocation = async (location: string): Promise<Offer[]> => {
  try {
    const offersRef = collection(db, 'offers');
    const now = new Date().toISOString().split('T')[0];
    const snapshot = await getDocs(offersRef);
    const offers: Offer[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as Offer;
      if (data.isActive && data.validTill >= now && data.locations.includes(location)) {
        offers.push({ id: doc.id, ...data });
      }
    });
    return offers;
  } catch (error) {
    console.error('Error fetching offers by location:', error);
    return [];
  }
};

// Get offer by promo code
export const getOfferByCode = async (code: string): Promise<Offer | null> => {
  try {
    const offersRef = collection(db, 'offers');
    const q = query(offersRef, where('code', '==', code.toUpperCase()));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Offer;
  } catch (error) {
    console.error('Error fetching offer by code:', error);
    return null;
  }
};

// Create new offer
export const createOffer = async (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>): Promise<string> => {
  try {
    const offersRef = collection(db, 'offers');
    const newOffer = {
      ...offerData,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(offersRef, newOffer);
    return docRef.id;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
};

// Update offer
export const updateOffer = async (offerId: string, offerData: Partial<Offer>): Promise<void> => {
  try {
    const offerRef = doc(db, 'offers', offerId);
    await updateDoc(offerRef, {
      ...offerData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
};

// Delete offer
export const deleteOffer = async (offerId: string): Promise<void> => {
  try {
    const offerRef = doc(db, 'offers', offerId);
    await deleteDoc(offerRef);
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
};

// Toggle offer active status
export const toggleOfferStatus = async (offerId: string, isActive: boolean): Promise<void> => {
  try {
    const offerRef = doc(db, 'offers', offerId);
    await updateDoc(offerRef, {
      isActive,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error toggling offer status:', error);
    throw error;
  }
};

// Increment offer usage count
export const incrementOfferUsage = async (offerId: string): Promise<void> => {
  try {
    const offerRef = doc(db, 'offers', offerId);
    const offerDoc = await getDoc(offerRef);
    if (offerDoc.exists()) {
      const currentCount = offerDoc.data().usedCount || 0;
      await updateDoc(offerRef, {
        usedCount: currentCount + 1,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error incrementing offer usage:', error);
  }
};

// Check if user is eligible for offer
export const isUserEligibleForOffer = (offer: Offer, userId?: string): boolean => {
  if (!offer.isActive) return false;
  
  const today = new Date().toISOString().split('T')[0];
  if (offer.validTill < today) return false;
  if (offer.usageLimit > 0 && offer.usedCount >= offer.usageLimit) return false;
  
  if (offer.targetAudience === 'specific_users' && userId) {
    return offer.specificUserIds.includes(userId);
  }
  
  return true;
};

// Calculate discounted fee
export const calculateDiscountedFee = (offer: Offer, originalFee: number): number => {
  if (offer.discountType === 'fixed') {
    return Math.max(0, originalFee - offer.discountValue);
  } else {
    return Math.max(0, originalFee - (originalFee * offer.discountValue / 100));
  }
};

// Get best offer for user
export const getBestOffer = (offers: Offer[], userId?: string): Offer | null => {
  const eligibleOffers = offers.filter(offer => isUserEligibleForOffer(offer, userId));
  if (eligibleOffers.length === 0) return null;
  
  // Return offer with highest discount
  return eligibleOffers.reduce((best, current) => {
    const bestDiscount = best.discountType === 'fixed' ? best.discountValue : best.discountValue;
    const currentDiscount = current.discountType === 'fixed' ? current.discountValue : current.discountValue;
    return currentDiscount > bestDiscount ? current : best;
  });
};