// src/app/components/OfferBanner.tsx

import { motion } from 'motion/react';
import { Tag, Gift, Zap, Clock, IndianRupee, Percent, X } from 'lucide-react';
import { useState } from 'react';
import { Offer } from '../../lib/offerService';

interface OfferBannerProps {
  offer: Offer;
  onClose?: () => void;
  onApply?: () => void;
  variant?: 'compact' | 'full' | 'card' | 'popup';
  className?: string;
}

const getOfferIcon = (type: string) => {
  switch (type) {
    case 'registration_discount': return Tag;
    case 'scholarship': return Gift;
    case 'festival': return Zap;
    case 'early_bird': return Clock;
    default: return Tag;
  }
};

const getOfferColor = (type: string) => {
  switch (type) {
    case 'registration_discount': return 'purple';
    case 'scholarship': return 'green';
    case 'festival': return 'orange';
    case 'early_bird': return 'pink';
    default: return 'purple';
  }
};

export function OfferBanner({ offer, onClose, onApply, variant = 'compact', className = '' }: OfferBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const Icon = getOfferIcon(offer.type);
  const color = getOfferColor(offer.type);
  
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    pink: 'bg-pink-50 border-pink-200 text-pink-700'
  };

  const buttonColorClasses = {
    purple: 'bg-purple-600 hover:bg-purple-700',
    green: 'bg-green-600 hover:bg-green-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    pink: 'bg-pink-600 hover:bg-pink-700'
  };

  const totalDiscount = offer.originalFee - offer.discountedFee;
  const discountPercent = Math.round((totalDiscount / offer.originalFee) * 100);

  if (dismissed) return null;

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-lg p-3 border ${colorClasses[color]} ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <div>
              <p className="text-xs font-semibold">{offer.name}</p>
              <p className="text-[10px] opacity-80">Save ₹{totalDiscount.toLocaleString()}</p>
            </div>
          </div>
          {onApply && (
            <button
              onClick={onApply}
              className={`text-xs px-2 py-1 rounded-full text-white ${buttonColorClasses[color]}`}
            >
              Apply
            </button>
          )}
          {onClose && (
            <button onClick={() => { setDismissed(true); onClose(); }} className="text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        className={`rounded-xl p-4 border shadow-sm ${colorClasses[color]} ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/50`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{offer.name}</h4>
            <p className="text-xs opacity-80 mt-0.5">{offer.description || `Get ${discountPercent}% off on registration`}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs line-through opacity-70">₹{offer.originalFee.toLocaleString()}</span>
              <span className="text-sm font-bold">₹{offer.discountedFee.toLocaleString()}</span>
              <span className="text-xs bg-white/30 px-1.5 py-0.5 rounded-full">Save ₹{totalDiscount.toLocaleString()}</span>
            </div>
            {onApply && (
              <button
                onClick={onApply}
                className={`mt-2 text-xs px-3 py-1 rounded-full text-white ${buttonColorClasses[color]}`}
              >
                Claim Offer →
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border-2 ${colorClasses[color]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/50`}>
            <Icon className={`w-7 h-7 text-${color}-600`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Limited Time Offer</span>
              {offer.code && (
                <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-mono">{offer.code}</span>
              )}
            </div>
            <h3 className="text-xl font-bold mt-1">{offer.name}</h3>
            <p className="text-sm opacity-80 mt-1">{offer.description || `Get amazing discount on your registration fee`}</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="text-center">
                <p className="text-xs opacity-70">Original</p>
                <p className="text-lg line-through">₹{offer.originalFee.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs opacity-70">Discounted</p>
                <p className="text-2xl font-bold">₹{offer.discountedFee.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs opacity-70">You Save</p>
                <p className="text-lg font-semibold text-green-600">₹{totalDiscount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {onApply && (
                <button
                  onClick={onApply}
                  className={`px-6 py-2 rounded-lg text-white font-semibold ${buttonColorClasses[color]}`}
                >
                  Apply Now
                </button>
              )}
              <p className="text-xs opacity-70 mt-2">
                Valid till {new Date(offer.validTill).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={() => { setDismissed(true); onClose(); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}