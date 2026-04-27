// src/admin/components/CollegeManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Plus, Edit, Trash2, Eye, Search, 
  X, CheckCircle, AlertCircle, RefreshCw, Download,
  MapPin, Star, Users, TrendingUp, GraduationCap,
  Image, Upload, FileText, Save, Copy, ChevronDown,
  Award, Wifi, Car, Coffee, Library, Home, Activity,
  Calendar, Medal, Hash, FileSignature
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

interface College {
  id: string;
  name: string;
  fullName?: string;
  location: string;
  rating: number;
  students: string;
  type: string;
  image: string;
  courses: string[];
  highestPackage: string;
  placementRate: string;
  fees: string;
  about?: string;
  description?: string;
  established?: string;
  accreditation?: string[];
  facilities?: string[];
  nirfRank?: string;
}

// Pre-defined options for dropdowns
const accreditationOptions = [
  "NAAC A+", "NAAC A", "NAAC A++", "NBA Accredited", "NIRF Rank 86",
  "NIRF Rank 101-150", "NIRF Rank 151-200", "QS Asia Ranking", 
  "ASIC UK", "ACBSP", "IET UK", "AICTE Approved", "UGC Recognized",
  "PCI Approved", "INC Approved", "BCI Approved", "NCTE Approved"
];

const facilityOptions = [
  "Smart Classrooms", "Apple iMac Lab", "NVIDIA AI Lab", "Digital Library",
  "Hostel", "Sports Complex", "Wi-Fi Campus", "Auditorium", "Incubation Center",
  "Research Labs", "Cafeteria", "Transport Facility", "Medical Facility",
  "Gymnasium", "Bank/ATM", "Moot Court", "Shooting Range", "Horse Riding Academy",
  "Swimming Pool", "Tennis Courts", "24/7 Security", "Medical Facility", "Cafeteria"
];

export function CollegeManagement() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [customId, setCustomId] = useState('');
  
  const [formData, setFormData] = useState<Partial<College>>({
    name: '',
    fullName: '',
    location: '',
    rating: 4.0,
    students: '',
    type: '',
    image: '',
    courses: [],
    highestPackage: '',
    placementRate: '',
    fees: '',
    about: '',
    description: '',
    established: '',
    accreditation: [],
    facilities: [],
    nirfRank: ''
  });
  
  const [courseInput, setCourseInput] = useState('');
  const [accreditationInput, setAccreditationInput] = useState('');
  const [facilityInput, setFacilityInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Dropdown states
  const [showAccreditationDropdown, setShowAccreditationDropdown] = useState(false);
  const [showFacilityDropdown, setShowFacilityDropdown] = useState(false);
  const [accreditationSearch, setAccreditationSearch] = useState('');
  const [facilitySearch, setFacilitySearch] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  // Generate custom ID suggestion from college name
  useEffect(() => {
    if (formData.name && !editingCollege) {
      const suggestedId = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setCustomId(suggestedId);
    }
  }, [formData.name, editingCollege]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const collegesRef = collection(db, 'colleges');
      const snapshot = await getDocs(collegesRef);
      const collegesList: College[] = [];
      snapshot.forEach((doc) => {
        collegesList.push({ id: doc.id, ...doc.data() } as College);
      });
      setColleges(collegesList);
    } catch (error) {
      showToast('Failed to fetch colleges', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `colleges/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location) {
      showToast('Please fill required fields', 'error');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = formData.image || '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const collegeData = {
        name: formData.name,
        fullName: formData.fullName || formData.name,
        location: formData.location,
        rating: formData.rating || 4.0,
        students: formData.students || '',
        type: formData.type || '',
        image: imageUrl,
        courses: formData.courses || [],
        highestPackage: formData.highestPackage || '',
        placementRate: formData.placementRate || '',
        fees: formData.fees || '',
        about: formData.about || formData.description || '',
        description: formData.description || formData.about || '',
        established: formData.established || '',
        accreditation: formData.accreditation || [],
        facilities: formData.facilities || [],
        nirfRank: formData.nirfRank || '',
        updatedAt: new Date().toISOString()
      };

      if (editingCollege) {
        const collegeRef = doc(db, 'colleges', editingCollege.id);
        await updateDoc(collegeRef, collegeData);
        showToast('College updated successfully', 'success');
      } else {
        // ✅ Use setDoc with custom readable ID
        const finalId = customId || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        await setDoc(doc(db, 'colleges', finalId), {
          ...collegeData,
          createdAt: new Date().toISOString(),
          id: finalId
        });
        showToast(`College added! ID: ${finalId}`, 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchColleges();
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to save college', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (college: College) => {
    if (confirm(`Are you sure you want to delete ${college.name}?`)) {
      try {
        await deleteDoc(doc(db, 'colleges', college.id));
        showToast('College deleted successfully', 'success');
        fetchColleges();
      } catch (error) {
        showToast('Failed to delete college', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingCollege(null);
    setFormData({
      name: '',
      fullName: '',
      location: '',
      rating: 4.0,
      students: '',
      type: '',
      image: '',
      courses: [],
      highestPackage: '',
      placementRate: '',
      fees: '',
      about: '',
      description: '',
      established: '',
      accreditation: [],
      facilities: [],
      nirfRank: ''
    });
    setCustomId('');
    setCourseInput('');
    setAccreditationInput('');
    setFacilityInput('');
    setImageFile(null);
  };

  const addCourse = () => {
    if (courseInput.trim()) {
      setFormData({
        ...formData,
        courses: [...(formData.courses || []), courseInput.trim()]
      });
      setCourseInput('');
    }
  };

  const removeCourse = (index: number) => {
    setFormData({
      ...formData,
      courses: formData.courses?.filter((_, i) => i !== index)
    });
  };

  const toggleAccreditation = (opt: string) => {
    if (formData.accreditation?.includes(opt)) {
      setFormData({
        ...formData,
        accreditation: formData.accreditation?.filter(a => a !== opt)
      });
    } else {
      setFormData({
        ...formData,
        accreditation: [...(formData.accreditation || []), opt]
      });
    }
  };

  const addCustomAccreditation = () => {
    if (accreditationSearch.trim() && !formData.accreditation?.includes(accreditationSearch.trim())) {
      setFormData({
        ...formData,
        accreditation: [...(formData.accreditation || []), accreditationSearch.trim()]
      });
      setAccreditationSearch('');
    }
  };

  const removeAccreditation = (index: number) => {
    setFormData({
      ...formData,
      accreditation: formData.accreditation?.filter((_, i) => i !== index)
    });
  };

  const toggleFacility = (opt: string) => {
    if (formData.facilities?.includes(opt)) {
      setFormData({
        ...formData,
        facilities: formData.facilities?.filter(f => f !== opt)
      });
    } else {
      setFormData({
        ...formData,
        facilities: [...(formData.facilities || []), opt]
      });
    }
  };

  const addCustomFacility = () => {
    if (facilitySearch.trim() && !formData.facilities?.includes(facilitySearch.trim())) {
      setFormData({
        ...formData,
        facilities: [...(formData.facilities || []), facilitySearch.trim()]
      });
      setFacilitySearch('');
    }
  };

  const removeFacility = (index: number) => {
    setFormData({
      ...formData,
      facilities: formData.facilities?.filter((_, i) => i !== index)
    });
  };

  const filteredAccreditations = accreditationOptions.filter(opt =>
    opt.toLowerCase().includes(accreditationSearch.toLowerCase())
  );
  const filteredFacilities = facilityOptions.filter(opt =>
    opt.toLowerCase().includes(facilitySearch.toLowerCase())
  );

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">🏛️ College Management</h2>
          <p className="text-sm text-gray-500">Manage colleges with readable IDs and all fields</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New College
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Colleges Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredColleges.map((college) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="relative h-40">
                <img
                  src={college.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={college.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => {
                      setEditingCollege(college);
                      setFormData(college);
                      setCustomId(college.id);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(college)}
                    className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{college.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  {college.location}
                </div>
                <div className="flex items-center gap-3 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {college.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {college.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {college.highestPackage}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {college.courses?.slice(0, 3).map((course, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {course}
                    </span>
                  ))}
                  {college.courses && college.courses.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                      +{college.courses.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-semibold text-purple-600">{college.fees?.split('-')[0]}</span>
                  <code className="text-xs text-gray-400">{college.id}</code>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit College Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCollege ? '✏️ Edit College' : '➕ Add New College'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Custom ID Field - NEW */}
                {!editingCollege && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Copy className="w-4 h-4 text-blue-600" /> Document ID (Readable)
                    </label>
                    <input
                      type="text"
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                      placeholder="Leave empty for auto"
                      className="w-full px-4 py-2 border rounded-lg font-mono text-sm bg-white"
                    />
                    <p className="text-xs text-blue-500 mt-1">💡 Suggested: {formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</p>
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Optional)</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g., Amity University Greater Noida Campus"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Greater Noida, Uttar Pradesh"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Type</label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., Engineering, Management, Multi-Discipline"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIRF Rank</label>
                    <input
                      type="text"
                      value={formData.nirfRank}
                      onChange={(e) => setFormData({ ...formData, nirfRank: e.target.value })}
                      placeholder="e.g., 35, 101-150, Top 200"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                      placeholder="e.g., 2005"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Students Count</label>
                    <input
                      type="text"
                      value={formData.students}
                      onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                      placeholder="e.g., 10,000+"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Highest Package</label>
                    <input
                      type="text"
                      value={formData.highestPackage}
                      onChange={(e) => setFormData({ ...formData, highestPackage: e.target.value })}
                      placeholder="e.g., 47 LPA"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement Rate</label>
                    <input
                      type="text"
                      value={formData.placementRate}
                      onChange={(e) => setFormData({ ...formData, placementRate: e.target.value })}
                      placeholder="e.g., 92%"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Structure</label>
                    <input
                      type="text"
                      value={formData.fees}
                      onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                      placeholder="e.g., ₹1.0 Lakhs/year"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Accreditation Multi-Select Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-600" /> Accreditation & Rankings
                  </label>
                  <div className="relative mb-3">
                    <button
                      type="button"
                      onClick={() => setShowAccreditationDropdown(!showAccreditationDropdown)}
                      className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center"
                    >
                      <span>{formData.accreditation?.length === 0 ? "Select Accreditations" : `${formData.accreditation?.length} selected`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAccreditationDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showAccreditationDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        <div className="sticky top-0 p-2 border-b bg-white">
                          <input type="text" placeholder="Search..." value={accreditationSearch} onChange={(e) => setAccreditationSearch(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div className="p-2 max-h-60 overflow-y-auto">
                          {filteredAccreditations.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg cursor-pointer">
                              <input type="checkbox" checked={formData.accreditation?.includes(opt)} onChange={() => toggleAccreditation(opt)} className="w-4 h-4" />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                          {accreditationSearch && !accreditationOptions.includes(accreditationSearch) && (
                            <button onClick={addCustomAccreditation} className="w-full text-left p-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
                              + Add "{accreditationSearch}"
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.accreditation?.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        {a} <button onClick={() => removeAccreditation(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Facilities Multi-Select Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" /> Campus Facilities
                  </label>
                  <div className="relative mb-3">
                    <button
                      type="button"
                      onClick={() => setShowFacilityDropdown(!showFacilityDropdown)}
                      className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center"
                    >
                      <span>{formData.facilities?.length === 0 ? "Select Facilities" : `${formData.facilities?.length} selected`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showFacilityDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showFacilityDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        <div className="sticky top-0 p-2 border-b bg-white">
                          <input type="text" placeholder="Search..." value={facilitySearch} onChange={(e) => setFacilitySearch(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div className="p-2 max-h-60 overflow-y-auto">
                          {filteredFacilities.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg cursor-pointer">
                              <input type="checkbox" checked={formData.facilities?.includes(opt)} onChange={() => toggleFacility(opt)} className="w-4 h-4" />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                          {facilitySearch && !facilityOptions.includes(facilitySearch) && (
                            <button onClick={addCustomFacility} className="w-full text-left p-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
                              + Add "{facilitySearch}"
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.facilities?.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {f} <button onClick={() => removeFacility(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Courses Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Courses Offered</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      placeholder="Add a course"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                    />
                    <button onClick={addCourse} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.courses?.map((course, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {course}
                        <button onClick={() => removeCourse(idx)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description / About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description / About</label>
                  <textarea
                    value={formData.description || formData.about}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value, about: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Describe the college..."
                  />
                </div>

                {/* College Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  {formData.image && !imageFile && (
                    <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : (editingCollege ? 'Update College' : 'Add College')}
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}