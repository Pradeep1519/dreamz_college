// src/admin/components/OffersManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tag, Plus, Edit, Trash2, Search, RefreshCw, 
  CheckCircle, AlertCircle, X, Save, Calendar,
  Users, Percent, IndianRupee, Clock, Eye, EyeOff,
  MapPin, Ticket, Gift, Zap, Target
} from 'lucide-react';
import { Offer, getAllOffers, createOffer, updateOffer, deleteOffer, toggleOfferStatus } from '../../lib/offerService';

const offerTypes = [
  { value: 'registration_discount', label: 'Registration Discount', icon: Tag, color: 'purple' },
  { value: 'scholarship', label: 'Scholarship', icon: Gift, color: 'green' },
  { value: 'referral', label: 'Referral Offer', icon: Users, color: 'blue' },
  { value: 'festival', label: 'Festival Offer', icon: Zap, color: 'orange' },
  { value: 'early_bird', label: 'Early Bird', icon: Clock, color: 'pink' }
];

const discountTypes = [
  { value: 'fixed', label: 'Fixed Amount (₹)', icon: IndianRupee },
  { value: 'percentage', label: 'Percentage (%)', icon: Percent }
];

const locationOptions = [
  { value: 'login_popup', label: 'Login Popup', icon: Users },
  { value: 'course_card', label: 'Course Cards', icon: Tag },
  { value: 'college_page', label: 'College Page', icon: MapPin },
  { value: 'apply_button', label: 'Apply Button', icon: Ticket },
  { value: 'hero_banner', label: 'Hero Banner', icon: Target }
];

const audienceOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'new_users', label: 'New Users Only' },
  { value: 'specific_users', label: 'Specific Users' }
];

export function OffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'registration_discount',
    discountType: 'fixed',
    discountValue: 0,
    originalFee: 10000,
    discountedFee: 8000,
    locations: [] as string[],
    validFrom: '',
    validTill: '',
    usageLimit: 100,
    targetAudience: 'all',
    specificUserIds: [] as string[],
    isActive: true,
    code: ''
  });

  const [userIdInput, setUserIdInput] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getAllOffers();
      setOffers(data);
    } catch (error) {
      showToast('Failed to fetch offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const addSpecificUser = () => {
    if (userIdInput.trim() && !formData.specificUserIds.includes(userIdInput.trim())) {
      setFormData(prev => ({
        ...prev,
        specificUserIds: [...prev.specificUserIds, userIdInput.trim()]
      }));
      setUserIdInput('');
    }
  };

  const removeSpecificUser = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      specificUserIds: prev.specificUserIds.filter(id => id !== userId)
    }));
  };

  const calculateDiscountedFee = () => {
    if (formData.discountType === 'fixed') {
      return Math.max(0, formData.originalFee - formData.discountValue);
    } else {
      return Math.max(0, formData.originalFee - (formData.originalFee * formData.discountValue / 100));
    }
  };

  useEffect(() => {
    const newDiscountedFee = calculateDiscountedFee();
    setFormData(prev => ({ ...prev, discountedFee: newDiscountedFee }));
  }, [formData.originalFee, formData.discountValue, formData.discountType]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.validFrom || !formData.validTill || formData.locations.length === 0) {
      showToast('Please fill required fields and select at least one location', 'error');
      return;
    }

    try {
      const offerData = {
        name: formData.name,
        description: formData.description,
        type: formData.type as any,
        discountType: formData.discountType as any,
        discountValue: formData.discountValue,
        originalFee: formData.originalFee,
        discountedFee: formData.discountedFee,
        locations: formData.locations,
        validFrom: formData.validFrom,
        validTill: formData.validTill,
        usageLimit: formData.usageLimit,
        targetAudience: formData.targetAudience as any,
        specificUserIds: formData.specificUserIds,
        isActive: formData.isActive,
        code: formData.code.toUpperCase()
      };

      if (editingOffer) {
        await updateOffer(editingOffer.id!, offerData);
        showToast('Offer updated successfully', 'success');
      } else {
        await createOffer(offerData);
        showToast('Offer created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchOffers();
    } catch (error) {
      showToast('Failed to save offer', 'error');
    }
  };

  const handleDelete = async (offer: Offer) => {
    if (confirm(`Delete offer "${offer.name}"?`)) {
      try {
        await deleteOffer(offer.id!);
        showToast('Offer deleted', 'success');
        fetchOffers();
      } catch (error) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const handleToggleStatus = async (offer: Offer) => {
    try {
      await toggleOfferStatus(offer.id!, !offer.isActive);
      showToast(`Offer ${!offer.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchOffers();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      name: '', description: '', type: 'registration_discount', discountType: 'fixed',
      discountValue: 0, originalFee: 10000, discountedFee: 8000, locations: [],
      validFrom: '', validTill: '', usageLimit: 100, targetAudience: 'all',
      specificUserIds: [], isActive: true, code: ''
    });
    setUserIdInput('');
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      description: offer.description || '',
      type: offer.type,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      originalFee: offer.originalFee,
      discountedFee: offer.discountedFee,
      locations: offer.locations,
      validFrom: offer.validFrom,
      validTill: offer.validTill,
      usageLimit: offer.usageLimit,
      targetAudience: offer.targetAudience,
      specificUserIds: offer.specificUserIds || [],
      isActive: offer.isActive,
      code: offer.code || ''
    });
    setIsModalOpen(true);
  };

  const filteredOffers = offers.filter(offer =>
    offer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      registration_discount: 'bg-purple-100 text-purple-700',
      scholarship: 'bg-green-100 text-green-700',
      referral: 'bg-blue-100 text-blue-700',
      festival: 'bg-orange-100 text-orange-700',
      early_bird: 'bg-pink-100 text-pink-700'
    };
    return colors[type] || colors.registration_discount;
  };

  const getLocationLabel = (location: string) => {
    const labels: Record<string, string> = {
      login_popup: '🔐 Login',
      course_card: '📚 Courses',
      college_page: '🏛️ Colleges',
      apply_button: '✍️ Apply',
      hero_banner: '🎯 Banner'
    };
    return labels[location] || location;
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white text-sm ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">🎁 Offer Management</h2>
          <p className="text-sm text-gray-500">Create and manage discounts, scholarships, and special offers</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Offers</p>
          <p className="text-2xl font-bold">{offers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{offers.filter(o => o.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Times Used</p>
          <p className="text-2xl font-bold text-purple-600">{offers.reduce((sum, o) => sum + (o.usedCount || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Savings</p>
          <p className="text-2xl font-bold text-green-600">₹2.5L+</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No offers created yet</div>
        ) : (
          filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(offer.type)}`}>
                        {offer.type.replace('_', ' ').toUpperCase()}
                      </span>
                      {offer.code && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Code: {offer.code}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{offer.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{offer.description || 'No description'}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggleStatus(offer)} className="p-1.5 rounded-lg hover:bg-gray-100">
                      {offer.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    </button>
                    <button onClick={() => handleEdit(offer)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(offer)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Discount Display */}
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Original Fee</p>
                      <p className="text-lg font-bold text-gray-700 line-through">₹{offer.originalFee.toLocaleString()}</p>
                    </div>
                    <Tag className="w-6 h-6 text-purple-600" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Discounted Fee</p>
                      <p className="text-xl font-bold text-purple-700">₹{offer.discountedFee.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Save ₹{(offer.originalFee - offer.discountedFee).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Locations */}
                <div className="flex flex-wrap gap-1">
                  {offer.locations.map(loc => (
                    <span key={loc} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {getLocationLabel(loc)}
                    </span>
                  ))}
                </div>

                {/* Validity & Usage */}
                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTill).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {offer.usedCount}/{offer.usageLimit}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Offer Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Early Bird 2026" /></div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-4 py-2 border rounded-lg" placeholder="Offer description" /></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Offer Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{offerTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-1">Discount Type</label><select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{discountTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Original Fee (₹)</label><input type="number" value={formData.originalFee} onChange={(e) => setFormData({ ...formData, originalFee: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Discount Value</label><input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Discounted Fee:</span>
                    <span className="text-2xl font-bold text-purple-700">₹{formData.discountedFee.toLocaleString()}</span>
                  </div>
                </div>

                <div><label className="block text-sm font-medium mb-1">Promo Code (Optional)</label><input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., EARLY2026" /></div>

                <div><label className="block text-sm font-medium mb-1">Display Locations *</label><div className="flex flex-wrap gap-2">{locationOptions.map(loc => (<button key={loc.value} type="button" onClick={() => handleLocationToggle(loc.value)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.locations.includes(loc.value) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{loc.label}</button>))}</div></div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Valid From *</label><input type="date" value={formData.validFrom} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Valid Till *</label><input type="date" value={formData.validTill} onChange={(e) => setFormData({ ...formData, validTill: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Usage Limit</label><input type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Target Audience</label><select value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{audienceOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                </div>

                {formData.targetAudience === 'specific_users' && (
                  <div><label className="block text-sm font-medium mb-1">Specific User IDs</label><div className="flex gap-2 mb-2"><input type="text" value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)} placeholder="Enter user ID" className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={addSpecificUser} className="px-4 py-2 bg-gray-100 rounded-lg">Add</button></div><div className="flex flex-wrap gap-2">{formData.specificUserIds.map(id => (<span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full text-sm">{id}<button onClick={() => removeSpecificUser(id)}><X className="w-3 h-3" /></button></span>))}</div></div>
                )}

                <div className="flex items-center gap-3"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" /><label>Active (show on website)</label></div>

                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={handleSubmit} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-semibold"><Save className="w-4 h-4 inline mr-2" />{editingOffer ? 'Update Offer' : 'Create Offer'}</button>
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-lg font-semibold">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}