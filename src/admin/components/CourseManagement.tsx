// src/admin/components/CourseManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Plus, Edit, Trash2, Search, RefreshCw, Download,
  IndianRupee, Save, X, University, FileText, 
  Star, TrendingUp, CheckCircle, AlertCircle, Building2,
  Calendar, Copy, ChevronDown
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, setDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface College {
  id: string;
  name: string;
}

interface YearFee {
  year: number;
  amount: number;
}

interface Course {
  id: string;
  name: string;
  collegeId: string;
  collegeName: string;
  category: string;
  duration: string;
  durationYears: number;
  durationSemesters: number;
  yearWiseFees: YearFee[];
  totalFee: number;
  registrationFee: number;
  semesterFee: number;
  seats: number;
  university: string;
  eligibility: string;
  examAccepted: string;
  affiliation: string;
  specializations: string[];
  highlights: string[];
  isActive: boolean;
}

const categoryOptions = [
  { value: 'engineering', label: '🏗️ Engineering' },
  { value: 'management', label: '📊 Management' },
  { value: 'pharmacy', label: '💊 Pharmacy' },
  { value: 'nursing', label: '🏥 Nursing' },
  { value: 'law', label: '⚖️ Law' },
  { value: 'it', label: '💻 IT & Computer' },
  { value: 'commerce', label: '📈 Commerce' },
  { value: 'education', label: '📚 Education' },
  { value: 'paramedical', label: '🩺 Paramedical' },
  { value: 'medical', label: '🏨 Medical' },
  { value: 'diploma', label: '📜 Diploma' },
  { value: 'pgdm', label: '🎓 PGDM' },
  { value: 'general', label: '📖 General' }
];

// University Templates
const universityTemplates = [
  "Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow",
  "Chandigarh University, Chandigarh",
  "Bennett University, Greater Noida",
  "CCS University, Meerut", "University of Lucknow, Lucknow",
  "Banaras Hindu University (BHU), Varanasi", "Aligarh Muslim University (AMU), Aligarh",
  "University of Delhi, Delhi", "Jamia Millia Islamia, New Delhi",
  "Guru Gobind Singh Indraprastha University (GGSIPU), Delhi",
  "Sharda University, Greater Noida", "Galgotias University, Greater Noida",
  "Amity University, Noida", "Bennett University, Greater Noida",
  "Guru Gobind Singh Indraprastha University (GGSIPU), Delhi"
];

// Specialization Options
const specializationOptions = [
  "Computer Science Engineering (CSE)", "Artificial Intelligence & Machine Learning",
  "Data Science", "Cloud Computing", "Cyber Security", "Internet of Things (IoT)",
  "Blockchain Technology", "Robotics & Automation", "Full Stack Development",
  "Digital Marketing", "Finance", "Human Resources (HR)", "Marketing Management",
  "Business Analytics", "Pharmaceutical Chemistry", "Pharmacology", "Clinical Research"
];

// Highlight Options
const highlightOptions = [
  "AICTE Approved", "NBA Accredited", "NAAC A+ Grade", "UGC Recognized",
  "100% Placement Assistance", "Industry Collaborations", "State-of-the-art Labs",
  "Experienced Faculty", "Internship Opportunities", "Modern Smart Classrooms",
  "Wi-Fi Campus", "Digital Library Access", "Hostel Facility", "Transport Facility",
  "Scholarship Available", "Soft Skills Training", "Career Counseling"
];

// Category-wise Exam Accepted
const examAcceptedByCategory: Record<string, string[]> = {
  engineering: ["JEE Main / UPSEE / CUET / BITSAT"],
  management: ["CAT / MAT / XAT / CMAT / GMAT / NMAT"],
  pharmacy: ["GPAT / NIPER JEE / CUET"],
  nursing: ["AIIMS Nursing / State Nursing Entrance / CUET"],
  law: ["CLAT / AILET / LSAT India / CUET"],
  general: ["Merit Based / CUET / University Entrance"]
};

// Category-wise Affiliation
const affiliationByCategory: Record<string, string[]> = {
  engineering: ["AICTE Approved", "NBA Accredited", "NAAC A+ Grade", "UGC Recognized"],
  management: ["AICTE Approved", "NBA Accredited", "NAAC A+ Grade", "UGC Recognized"],
  pharmacy: ["PCI Approved", "AICTE Approved", "NAAC A+ Grade"],
  nursing: ["INC Approved", "AICTE Approved", "NAAC A+ Grade"],
  law: ["BCI Approved", "UGC Recognized", "NAAC A+ Grade"],
  general: ["UGC Recognized", "NAAC A+ Grade"]
};

// Category-wise Eligibility
const eligibilityByCategory: Record<string, string[]> = {
  engineering: ["10+2 with PCM with minimum 45% marks. Valid JEE Main/CUET score.","Bachelor's degree in relevant field for lateral entry.","Bachelor's degree with 50% marks for PG courses."],
  management: ["10+2 with minimum 50% marks from any recognized board.","Graduation in any discipline with minimum 50% marks. Valid CAT/MAT/CMAT score for MBA.","Postgraduate degree with minimum 50% marks for PGDM."],
  pharmacy: ["10+2 with PCB/PCM with minimum 50% marks.", "Bachelor's degree in Pharmacy (B.Pharm) with minimum 50% marks for M.Pharm.", "Valid GPAT score for M.Pharm."],
  nursing: ["10+2 with PCB with minimum 45% marks. Minimum age 17 years."],
  law: ["10+2 with minimum 45% marks. Valid CLAT/AILET score.", "Graduation in any discipline with minimum 45% marks for 3-year LLB. Valid CLAT/AILET score.", "Postgraduate degree with minimum 45% marks for LLM. Valid CLAT PG score."],
  general: ["10+2 pass from any recognized board with minimum 45% marks.", "Graduation in any discipline with minimum 45% marks.", "Postgraduate degree with minimum 45% marks."]
};

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [customId, setCustomId] = useState('');
  
  const [yearWiseFees, setYearWiseFees] = useState<YearFee[]>([
    { year: 1, amount: 0 }, { year: 2, amount: 0 }, { year: 3, amount: 0 }, { year: 4, amount: 0 }
  ]);
  
  const [formData, setFormData] = useState({
    name: '', collegeId: '', collegeName: '', category: 'engineering', duration: '4 Years',
    durationYears: 4, durationSemesters: 8, totalFee: 0, registrationFee: 10000,
    seats: 60, university: '', eligibility: '', examAccepted: '', affiliation: '',
    specializations: [] as string[], highlights: [] as string[], isActive: true
  });

  // Dropdown states
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [showHighlightDropdown, setShowHighlightDropdown] = useState(false);
  const [specializationSearch, setSpecializationSearch] = useState('');
  const [highlightSearch, setHighlightSearch] = useState('');

  const [selectedEligibilityTemplate, setSelectedEligibilityTemplate] = useState('');
  const [selectedUniversityTemplate, setSelectedUniversityTemplate] = useState('');
  const [selectedAffiliationTemplate, setSelectedAffiliationTemplate] = useState('');
  const [selectedExamAcceptedTemplate, setSelectedExamAcceptedTemplate] = useState('');

  // Generate custom ID
  useEffect(() => {
    if (formData.collegeId && formData.name) {
      const collegeSlug = formData.collegeId.toLowerCase().replace(/\s+/g, '-');
      const courseSlug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setCustomId(`${collegeSlug}_${courseSlug}`);
    }
  }, [formData.collegeId, formData.name]);

  // Update year-wise fees on duration change
  useEffect(() => {
    const newYears = [];
    for (let i = 0; i < formData.durationYears; i++) {
      newYears.push({ year: i + 1, amount: yearWiseFees[i]?.amount || 0 });
    }
    setYearWiseFees(newYears);
  }, [formData.durationYears]);

  // Calculate total fee
  useEffect(() => {
    const total = yearWiseFees.reduce((sum, y) => sum + (y.amount || 0), 0);
    setFormData(prev => ({ ...prev, totalFee: total, durationSemesters: prev.durationYears * 2 }));
  }, [yearWiseFees]);

  useEffect(() => {
    fetchColleges();
    fetchCourses();
  }, []);

  const fetchColleges = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'colleges'));
      const list: College[] = [];
      snapshot.forEach(doc => list.push({ id: doc.id, name: doc.data().name }));
      setColleges(list);
    } catch (error) { console.error(error); }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
      const list: Course[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        list.push({
          id: doc.id, name: d.name || '', collegeId: d.collegeId || '', collegeName: d.collegeName || '',
          category: d.category || 'general', duration: d.duration || '', durationYears: d.durationYears || 4,
          durationSemesters: d.durationSemesters || 8, yearWiseFees: d.yearWiseFees || [],
          totalFee: d.totalFee || 0, registrationFee: d.registrationFee || 10000,
          semesterFee: d.semesterFee || 0, seats: d.seats || 60, university: d.university || '',
          eligibility: d.eligibility || '', examAccepted: d.examAccepted || '', affiliation: d.affiliation || '',
          specializations: d.specializations || [], highlights: d.highlights || [], isActive: d.isActive !== false
        });
      });
      setCourses(list);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string, type: string) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateYearFee = (idx: number, amt: number) => {
    const newFees = [...yearWiseFees];
    newFees[idx] = { ...newFees[idx], amount: amt };
    setYearWiseFees(newFees);
  };

  const toggleSpecialization = (opt: string) => {
    if (formData.specializations.includes(opt)) {
      setFormData({ ...formData, specializations: formData.specializations.filter(s => s !== opt) });
    } else {
      setFormData({ ...formData, specializations: [...formData.specializations, opt] });
    }
  };

  const addCustomSpecialization = () => {
    if (specializationSearch.trim() && !formData.specializations.includes(specializationSearch.trim())) {
      setFormData({ ...formData, specializations: [...formData.specializations, specializationSearch.trim()] });
      setSpecializationSearch('');
    }
  };

  const removeSpecialization = (idx: number) => {
    setFormData({ ...formData, specializations: formData.specializations.filter((_, i) => i !== idx) });
  };

  const toggleHighlight = (opt: string) => {
    if (formData.highlights.includes(opt)) {
      setFormData({ ...formData, highlights: formData.highlights.filter(h => h !== opt) });
    } else {
      setFormData({ ...formData, highlights: [...formData.highlights, opt] });
    }
  };

  const addCustomHighlight = () => {
    if (highlightSearch.trim() && !formData.highlights.includes(highlightSearch.trim())) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightSearch.trim()] });
      setHighlightSearch('');
    }
  };

  const removeHighlight = (idx: number) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.collegeId) {
      showToast('Please fill course name and select college', 'error');
      return;
    }

    try {
      const collegeObj = colleges.find(c => c.id === formData.collegeId);
      const finalId = customId || `${collegeObj?.name?.toLowerCase().replace(/\s+/g, '-')}_${formData.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      const courseData = {
        name: formData.name, collegeId: formData.collegeId, collegeName: collegeObj?.name || '',
        category: formData.category, duration: formData.duration, durationYears: Number(formData.durationYears),
        durationSemesters: Number(formData.durationSemesters), yearWiseFees: yearWiseFees.filter(f => f.amount > 0),
        totalFee: Number(formData.totalFee), registrationFee: Number(formData.registrationFee),
        seats: Number(formData.seats), university: formData.university,
        eligibility: formData.eligibility, examAccepted: formData.examAccepted, affiliation: formData.affiliation,
        specializations: formData.specializations, highlights: formData.highlights, isActive: formData.isActive,
        updatedAt: new Date().toISOString()
      };

      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
        showToast('Course updated!', 'success');
      } else {
        await setDoc(doc(db, 'courses', finalId), { ...courseData, createdAt: new Date().toISOString() });
        showToast(`Course added! ID: ${finalId}`, 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      showToast('Failed: ' + error.message, 'error');
    }
  };

  const handleDelete = async (course: Course) => {
    if (confirm(`Delete "${course.name}"?`)) {
      try {
        await deleteDoc(doc(db, 'courses', course.id));
        showToast('Deleted!', 'success');
        fetchCourses();
      } catch (error) { showToast('Delete failed', 'error'); }
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name, collegeId: course.collegeId, collegeName: course.collegeName, category: course.category,
      duration: course.duration, durationYears: course.durationYears, durationSemesters: course.durationSemesters,
      totalFee: course.totalFee, registrationFee: course.registrationFee,
      seats: course.seats, university: course.university, eligibility: course.eligibility,
      examAccepted: course.examAccepted, affiliation: course.affiliation,
      specializations: course.specializations, highlights: course.highlights, isActive: course.isActive
    });
    if (course.yearWiseFees.length) {
      setYearWiseFees(course.yearWiseFees);
    } else {
      setYearWiseFees(Array.from({ length: course.durationYears || 4 }, (_, i) => ({ year: i + 1, amount: 0 })));
    }
    setCustomId(course.id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      name: '', collegeId: '', collegeName: '', category: 'engineering', duration: '4 Years',
      durationYears: 4, durationSemesters: 8, totalFee: 0, registrationFee: 10000,
      seats: 60, university: '', eligibility: '', examAccepted: '', affiliation: '',
      specializations: [], highlights: [], isActive: true
    });
    setYearWiseFees([{ year: 1, amount: 0 }, { year: 2, amount: 0 }, { year: 3, amount: 0 }, { year: 4, amount: 0 }]);
    setCustomId('');
    setSpecializationSearch('');
    setHighlightSearch('');
    setSelectedEligibilityTemplate('');
    setSelectedUniversityTemplate('');
    setSelectedAffiliationTemplate('');
    setSelectedExamAcceptedTemplate('');
  };

  const exportCSV = () => {
    const headers = ['ID', 'Course', 'College', 'Category', 'Duration', 'Total Fee', 'Seats', 'Status'];
    const rows = filteredCourses.map(c => [c.id, c.name, c.collegeName, c.category, c.duration, c.totalFee, c.seats, c.isActive ? 'Active' : 'Inactive']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported!', 'success');
  };

  const filteredCourses = courses.filter(c => {
    const match = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCollege = selectedCollege ? c.collegeId === selectedCollege : true;
    return match && matchCollege;
  });

  const examOptions = examAcceptedByCategory[formData.category] || examAcceptedByCategory.general;
  const affiliationOptions = affiliationByCategory[formData.category] || affiliationByCategory.general;
  const eligibilityOptions = eligibilityByCategory[formData.category] || eligibilityByCategory.general;
  const filteredSpecializations = specializationOptions.filter(opt => opt.toLowerCase().includes(specializationSearch.toLowerCase()));
  const filteredHighlights = highlightOptions.filter(opt => opt.toLowerCase().includes(highlightSearch.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Toast */}
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
          <h2 className="text-xl font-semibold text-gray-900">📚 Course Management</h2>
          <p className="text-sm text-gray-500">Year-wise Fee | Category-wise Templates</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"><Download className="w-4 h-4" /> Export</button>
          <button onClick={fetchCourses} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"><RefreshCw className="w-4 h-4" /> Refresh</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-sm text-gray-500">Total Courses</p><p className="text-2xl font-bold">{courses.length}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-green-600">{courses.filter(c => c.isActive).length}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-sm text-gray-500">Colleges</p><p className="text-2xl font-bold text-blue-600">{colleges.length}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-sm text-gray-500">Categories</p><p className="text-2xl font-bold text-purple-600">{categoryOptions.length}</p></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, college or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">All Colleges</option>
            {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">College</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Total Fee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">No courses found</td>
                </tr>
              )}
              {!loading && filteredCourses.map((course) => (
                <tr key={course.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">{course.id}</code></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-600" /><span className="font-medium">{course.name}</span></div></td>
                  <td className="px-4 py-3 text-sm">{course.collegeName}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{course.category}</span></td>
                  <td className="px-4 py-3 text-sm">{course.duration}</td>
                  <td className="px-4 py-3"><span className="font-semibold text-blue-600">₹{course.totalFee?.toLocaleString()}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{course.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(course)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(course)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-xl font-bold">{editingCourse ? '✏️ Edit Course' : '➕ Add New Course'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <div className="space-y-4">
                {/* Custom ID */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <label className="block text-sm font-medium mb-1"><Copy className="w-4 h-4 inline text-blue-600" /> Document ID</label>
                  <input type="text" value={customId} onChange={(e) => setCustomId(e.target.value)} placeholder="Leave empty for auto" className="w-full px-4 py-2 border rounded-lg font-mono text-sm" disabled={!!editingCourse} />
                  {!editingCourse && <p className="text-xs text-blue-500 mt-1">Suggested: {customId}</p>}
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Course Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">College *</label><select value={formData.collegeId} onChange={(e) => { const c = colleges.find(c => c.id === e.target.value); setFormData({ ...formData, collegeId: e.target.value, collegeName: c?.name || '' }); }} className="w-full px-4 py-2 border rounded-lg"><option value="">Select College</option>{colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                </div>

                {/* Category & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-1">Duration (Years)</label><input type="number" min="1" max="6" value={formData.durationYears} onChange={(e) => setFormData({ ...formData, durationYears: parseInt(e.target.value), duration: `${parseInt(e.target.value)} Years` })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Semesters</label><input type="number" value={formData.durationSemesters} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" /></div>
                </div>

                {/* Year-wise Fee */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">📅 Year-wise Fee Structure</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {yearWiseFees.map((year, idx) => (
                      <div key={year.year} className="bg-gray-50 rounded-lg p-3">
                        <label className="block text-sm font-medium mb-1">Year {year.year} Fee (₹)</label>
                        <input type="number" value={year.amount} onChange={(e) => updateYearFee(idx, parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div><p className="text-sm font-medium text-purple-700">Total Fee</p></div>
                      <div><p className="text-2xl font-bold text-purple-700">₹{formData.totalFee.toLocaleString()}</p></div>
                    </div>
                  </div>
                </div>

                {/* Registration & Seats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Registration Fee (₹)</label><input type="number" value={formData.registrationFee} onChange={(e) => setFormData({ ...formData, registrationFee: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Total Seats</label><input type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>

                {/* University */}
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-1"><University className="w-4 h-4 inline text-blue-600" /> University</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><select value={selectedUniversityTemplate} onChange={(e) => { setSelectedUniversityTemplate(e.target.value); setFormData({ ...formData, university: e.target.value }); }} className="w-full px-4 py-2 border rounded-lg bg-gray-50"><option value="">Select University</option>{universityTemplates.map((u, i) => <option key={i} value={u}>{u}</option>)}</select></div>
                    <div><input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} placeholder="Custom university" className="w-full px-4 py-2 border rounded-lg" /></div>
                  </div>
                </div>

                {/* Exam Accepted */}
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-1"><FileText className="w-4 h-4 inline text-orange-600" /> Exam Accepted</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><select value={selectedExamAcceptedTemplate} onChange={(e) => { setSelectedExamAcceptedTemplate(e.target.value); setFormData({ ...formData, examAccepted: e.target.value }); }} className="w-full px-4 py-2 border rounded-lg bg-gray-50"><option value="">Select Exam ({formData.category})</option>{examOptions.map((e, i) => <option key={i} value={e}>{e}</option>)}</select></div>
                    <div><input type="text" value={formData.examAccepted} onChange={(e) => setFormData({ ...formData, examAccepted: e.target.value })} placeholder="Custom exam" className="w-full px-4 py-2 border rounded-lg" /></div>
                  </div>
                </div>

                {/* Affiliation */}
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-1"><Building2 className="w-4 h-4 inline text-purple-600" /> Affiliation</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><select value={selectedAffiliationTemplate} onChange={(e) => { setSelectedAffiliationTemplate(e.target.value); setFormData({ ...formData, affiliation: e.target.value }); }} className="w-full px-4 py-2 border rounded-lg bg-gray-50"><option value="">Select Affiliation ({formData.category})</option>{affiliationOptions.map((a, i) => <option key={i} value={a}>{a}</option>)}</select></div>
                    <div><input type="text" value={formData.affiliation} onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })} placeholder="Custom affiliation" className="w-full px-4 py-2 border rounded-lg" /></div>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-1"><FileText className="w-4 h-4 inline text-red-600" /> Eligibility Criteria</label>
                  <div className="grid grid-cols-1 gap-3">
                    <select value={selectedEligibilityTemplate} onChange={(e) => { setSelectedEligibilityTemplate(e.target.value); setFormData({ ...formData, eligibility: e.target.value }); }} className="w-full px-4 py-2 border rounded-lg bg-gray-50"><option value="">Select Eligibility ({formData.category})</option>{eligibilityOptions.map((el, i) => <option key={i} value={el}>{el}</option>)}</select>
                    <textarea value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })} rows={2} className="w-full px-4 py-2 border rounded-lg" placeholder="Or type custom eligibility..." />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                  <label>✅ Course Active</label>
                </div>

                {/* Specializations Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-600" /> ⭐ Specializations
                  </label>
                  <div className="relative mb-3">
                    <button
                      type="button"
                      onClick={() => setShowSpecializationDropdown(!showSpecializationDropdown)}
                      className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center"
                    >
                      <span>{formData.specializations.length === 0 ? "Select Specializations" : `${formData.specializations.length} selected`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSpecializationDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showSpecializationDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        <div className="sticky top-0 p-2 border-b bg-white">
                          <input type="text" placeholder="Search..." value={specializationSearch} onChange={(e) => setSpecializationSearch(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div className="p-2 max-h-60 overflow-y-auto">
                          {filteredSpecializations.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg cursor-pointer">
                              <input type="checkbox" checked={formData.specializations.includes(opt)} onChange={() => toggleSpecialization(opt)} className="w-4 h-4" />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                          {specializationSearch && !specializationOptions.includes(specializationSearch) && (
                            <button onClick={addCustomSpecialization} className="w-full text-left p-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
                              + Add "{specializationSearch}"
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {s} <button onClick={() => removeSpecialization(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" /> 🔥 Course Highlights
                  </label>
                  <div className="relative mb-3">
                    <button
                      type="button"
                      onClick={() => setShowHighlightDropdown(!showHighlightDropdown)}
                      className="w-full px-4 py-2 border rounded-lg bg-white text-left flex justify-between items-center"
                    >
                      <span>{formData.highlights.length === 0 ? "Select Highlights" : `${formData.highlights.length} selected`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showHighlightDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showHighlightDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        <div className="sticky top-0 p-2 border-b bg-white">
                          <input type="text" placeholder="Search..." value={highlightSearch} onChange={(e) => setHighlightSearch(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div className="p-2 max-h-60 overflow-y-auto">
                          {filteredHighlights.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg cursor-pointer">
                              <input type="checkbox" checked={formData.highlights.includes(opt)} onChange={() => toggleHighlight(opt)} className="w-4 h-4" />
                              <span className="text-sm">{opt}</span>
                            </label>
                          ))}
                          {highlightSearch && !highlightOptions.includes(highlightSearch) && (
                            <button onClick={addCustomHighlight} className="w-full text-left p-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
                              + Add "{highlightSearch}"
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
                        {h} <button onClick={() => removeHighlight(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={handleSubmit} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {editingCourse ? 'Update Course' : 'Add Course'}
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-lg font-semibold">
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