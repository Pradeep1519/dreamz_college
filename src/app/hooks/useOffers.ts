// src/hooks/useOffers.ts

import { useState, useEffect, useCallback } from 'react';
import { Offer, getActiveOffers, getOffersByLocation, getBestOffer, isUserEligibleForOffer } from '../../lib/offerService';
import { useAuth } from '../../context/AuthContext';

interface UseOffersOptions {
  location?: string;
  autoFetch?: boolean;
}

export function useOffers(options: UseOffersOptions = {}) {
  const { location, autoFetch = true } = options;
  const { user } = useAuth();
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bestOffer, setBestOffer] = useState<Offer | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedOffers: Offer[];
      if (location) {
        fetchedOffers = await getOffersByLocation(location);
      } else {
        fetchedOffers = await getActiveOffers();
      }
      setOffers(fetchedOffers);
      
      // Calculate best offer for current user
      const best = getBestOffer(fetchedOffers, user?.uid);
      setBestOffer(best);
    } catch (err) {
      setError('Failed to fetch offers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [location, user?.uid]);

  useEffect(() => {
    if (autoFetch) {
      fetchOffers();
    }
  }, [autoFetch, fetchOffers]);

  const getOffersForLocation = useCallback(async (loc: string) => {
    try {
      return await getOffersByLocation(loc);
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  const checkUserEligibility = useCallback((offer: Offer) => {
    return isUserEligibleForOffer(offer, user?.uid);
  }, [user?.uid]);

  return {
    offers,
    loading,
    error,
    bestOffer,
    fetchOffers,
    getOffersForLocation,
    checkUserEligibility,
    hasOffers: offers.length > 0,
    hasBestOffer: bestOffer !== null
  };
}