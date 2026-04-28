// src/app/components/OfferPopup.tsx

import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Tag, Zap, Clock, IndianRupee, Percent, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Offer } from '../../lib/offerService';

interface OfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
  onApply?: () => void;
}

export function OfferPopup({ isOpen, onClose, offer, onApply }: OfferPopupProps) {
  const [copied, setCopied] = useState(false);

  if (!offer) return null;

  const totalDiscount = offer.originalFee - offer.discountedFee;
  const discountPercent = Math.round((totalDiscount / offer.originalFee) * 100);

  const handleCopyCode = () => {
    if (offer.code) {
      navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getOfferIcon = () => {
    switch (offer.type) {
      case 'registration_discount': return Tag;
      case 'scholarship': return Gift;
      case 'festival': return Zap;
      case 'early_bird': return Clock;
      default: return Tag;
    }
  };

  const Icon = getOfferIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[201]"
          >
            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-2xl shadow-2xl overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">🎉 Special Offer! 🎉</h2>
                <p className="text-white/90 text-sm mb-4">{offer.name}</p>
                
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <p className="text-white/80 text-sm line-through">Regular Price: ₹{offer.originalFee.toLocaleString()}</p>
                  <p className="text-3xl font-bold text-white mt-1">₹{offer.discountedFee.toLocaleString()}</p>
                  <p className="text-green-300 text-sm font-semibold mt-1">Save ₹{totalDiscount.toLocaleString()} ({discountPercent}% OFF)</p>
                </div>

                <p className="text-white/80 text-sm mb-4">
                  {offer.description || `Get ${discountPercent}% discount on registration fee!`}
                </p>

                {offer.code && (
                  <div className="mb-4">
                    <p className="text-white/70 text-xs mb-1">Use Promo Code:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white/20 rounded-lg px-4 py-2 text-white font-mono text-lg tracking-wider">
                        {offer.code}
                      </code>
                      <button
                        onClick={handleCopyCode}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white text-sm font-medium transition"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (onApply) onApply();
                    onClose();
                  }}
                  className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  Claim Offer Now →
                </button>

                <p className="text-white/50 text-xs mt-3">
                  Limited time offer • Valid till {new Date(offer.validTill).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}