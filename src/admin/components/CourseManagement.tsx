// src/admin/components/CourseManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Plus, Edit, Trash2, Search, RefreshCw, Download,
  IndianRupee, Save, X, University, FileText, 
  Star, TrendingUp, CheckCircle, AlertCircle, Calculator, Building2
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface College {
  id: string;
  name: string;
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
  feePerYear: number;
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

// ✅ UNIVERSITY TEMPLATES
const universityTemplates = [
  { label: "🏛️ Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow", value: "Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow" },
  { label: "🏛️ CCS University, Meerut", value: "CCS University, Meerut" },
  { label: "🏛️ GGSIPU, Delhi", value: "Guru Gobind Singh Indraprastha University (GGSIPU), Delhi" },
  { label: "🏛️ UPBTE, Lucknow", value: "Uttar Pradesh Board of Technical Education (UPBTE), Lucknow" },
  { label: "🏛️ Atal Bihari Vajpayee Medical University, Lucknow", value: "Atal Bihari Vajpayee Medical University, Lucknow" },
  { label: "🏛️ Mahayogi Guru Gorakhnath AYUSH University", value: "Mahayogi Guru Gorakhnath AYUSH University" },
  { label: "🏛️ Noida International University (NIU)", value: "Noida International University (NIU)" },
  { label: "🏛️ Bennett University", value: "Bennett University" },
  { label: "🏛️ Sharda University", value: "Sharda University" },
  { label: "🏛️ Galgotias University", value: "Galgotias University" },
  { label: "🏛️ Amity University", value: "Amity University" },
  { label: "🏛️ Allahabad State University", value: "Allahabad State University" },
  { label: "🏛️ Rajasthan Technical University (RTU)", value: "Rajasthan Technical University (RTU)" }
];

// ✅ AFFILIATION TEMPLATES
const affiliationTemplates = [
  { label: "✓ AICTE Approved", value: "AICTE Approved" },
  { label: "✓ UGC Recognized", value: "UGC Recognized" },
  { label: "✓ NBA Accredited", value: "NBA Accredited" },
  { label: "✓ NAAC A+ Grade", value: "NAAC A+ Grade" },
  { label: "✓ PCI Approved", value: "PCI Approved" },
  { label: "✓ INC Approved", value: "INC Approved" },
  { label: "✓ BCI Approved", value: "BCI Approved" },
  { label: "✓ NCTE Approved", value: "NCTE Approved" },
  { label: "✓ ISO 9001:2015 Certified", value: "ISO 9001:2015 Certified" },
  { label: "✓ QS I-Gauge Rated", value: "QS I-Gauge Rated" },
  { label: "✓ NIRF Ranked", value: "NIRF Ranked" }
];

// ✅ ELIGIBILITY TEMPLATES
const eligibilityTemplates = [
  { label: "🎓 B.Tech / Engineering", value: "10+2 with Physics, Chemistry, Mathematics (PCM) with minimum 45% marks (40% for SC/ST). JEE Main/UPSEE/CUET qualified." },
  { label: "🎓 BBA / Management", value: "10+2 with minimum 50% marks from any recognized board. English as compulsory subject." },
  { label: "💻 BCA / IT", value: "10+2 with Mathematics/Computer Science with minimum 45% marks." },
  { label: "📚 MBA / PG", value: "Bachelor's degree with minimum 50% marks (45% for SC/ST). Valid score in CAT/MAT/CMAT." },
  { label: "📚 PGDM", value: "Bachelor's degree with minimum 50% marks. Valid score in CAT/MAT/CMAT/XAT." },
  { label: "💊 B.Pharm / Pharmacy", value: "10+2 with PCB/PCM with minimum 50% marks." },
  { label: "🏥 B.Sc Nursing", value: "10+2 with PCB with minimum 45% marks. Age: Minimum 17 years." },
  { label: "⚖️ LL.B / Law", value: "Graduation with minimum 45% marks (40% for SC/ST)." },
  { label: "🔧 Diploma", value: "10th pass with minimum 35% marks." }
];

// ✅ EXAM ACCEPTED TEMPLATES (NEW)
const examAcceptedTemplates = [
  { label: "🎓 Engineering (B.Tech/B.E)", value: "JEE Main / UPSEE / CUET / University Entrance Exam" },
  { label: "📊 Management (BBA/MBA)", value: "CAT / MAT / XAT / CMAT / ATMA / CUET" },
  { label: "💻 IT & Computer (BCA/MCA)", value: "CUET / NIMCET (for MCA) / University Entrance Exam" },
  { label: "💊 Pharmacy (B.Pharm/D.Pharm)", value: "CUET / GPAT (for PG) / State Pharmacy Entrance Exam" },
  { label: "🏥 Nursing (B.Sc Nursing/GNM)", value: "State Nursing Entrance Exam / AIIMS Nursing / JIPMER / CUET" },
  { label: "⚖️ Law (LL.B/BA LL.B)", value: "CLAT / AILET / LSAT India / CUET / State Law Entrance Exam" },
  { label: "📚 Education (B.Ed/M.Ed)", value: "DU B.Ed Entrance / CUET / State B.Ed Entrance Exam" },
  { label: "🩺 Paramedical (BPT/MLT)", value: "University Entrance Exam / State Paramedical Entrance / CUET" },
  { label: "📈 Commerce (B.Com/M.Com)", value: "CUET / Merit-Based / University Entrance Exam" },
  { label: "📖 General (BA/B.Sc)", value: "Merit-Based / CUET / Direct Admission" }
];

// ✅ HIGHLIGHTS TEMPLATES (Category Wise - NEW)
const highlightsByCategory: Record<string, string[]> = {
  engineering: [
    "✅ AICTE Approved",
    "✅ NBA Accredited",
    "✅ 100% Placement Assistance",
    "✅ Industry Collaborations with Google, Microsoft",
    "✅ State-of-the-art Labs",
    "✅ Experienced Faculty",
    "✅ Internship Opportunities",
    "✅ Hackathon & Coding Culture",
    "✅ Modern Smart Classrooms",
    "✅ Research & Development Cell"
  ],
  management: [
    "✅ AICTE Approved",
    "✅ Industry-oriented Curriculum",
    "✅ Corporate Mentorship Program",
    "✅ Live Projects with Companies",
    "✅ Entrepreneurship Cell",
    "✅ Regular Industrial Visits",
    "✅ Personality Development Sessions",
    "✅ Placement Record: 90%+",
    "✅ Summer Internship Program",
    "✅ Leadership Talks by CEOs"
  ],
  pharmacy: [
    "✅ PCI Approved",
    "✅ Well-equipped Labs",
    "✅ Herbal Garden",
    "✅ Industry Tie-ups with Top Pharma Companies",
    "✅ Research Opportunities",
    "✅ Hands-on Training",
    "✅ Placement in Top Pharma Companies",
    "✅ Drug Testing Facility"
  ],
  nursing: [
    "✅ INC Approved",
    "✅ Clinical Training at Multi-specialty Hospital",
    "✅ Advanced Simulation Labs",
    "✅ Experienced Nursing Faculty",
    "✅ 24/7 Library Access",
    "✅ Hostel Facility for Girls",
    "✅ Community Health Programs",
    "✅ National/International Placements"
  ],
  law: [
    "✅ BCI Approved",
    "✅ Moot Court Hall",
    "✅ Legal Aid Clinic",
    "✅ Internship with Top Law Firms",
    "✅ Guest Lectures by Judges",
    "✅ Debate & Discussion Forums",
    "✅ Research Papers Publication",
    "✅ Court Visits & Exposure"
  ],
  it: [
    "✅ Industry Standard Curriculum",
    "✅ Cloud Computing Lab",
    "✅ AI/ML Specialization",
    "✅ Coding Competitions",
    "✅ Tech Club Activities",
    "✅ Certification Courses (AWS, Azure)",
    "✅ Software Development Projects",
    "✅ Placement in MNCs"
  ],
  commerce: [
    "✅ Industry-Aligned Curriculum",
    "✅ Practical Training in Tally, SAP",
    "✅ Banking & Finance Workshops",
    "✅ CA/CS Coaching Support",
    "✅ Corporate Interaction",
    "✅ Placement Assistance",
    "✅ Stock Market Lab"
  ],
  education: [
    "✅ NCTE Approved",
    "✅ Experienced Faculty",
    "✅ Teaching Practice in Partner Schools",
    "✅ Psychology Lab",
    "✅ Educational Tours",
    "✅ Research Opportunities"
  ],
  paramedical: [
    "✅ AICTE/PCI Approved",
    "✅ Advanced Medical Labs",
    "✅ Clinical Training at Top Hospitals",
    "✅ Experienced Medical Faculty",
    "✅ Modern Equipment",
    "✅ Hospital Internship",
    "✅ 100% Placement Support"
  ],
  diploma: [
    "✅ AICTE Approved",
    "✅ Practical Training",
    "✅ Industry Visits",
    "✅ Workshop Facilities",
    "✅ Experienced Instructors",
    "✅ Job Placement Support",
    "✅ Affordable Fee Structure"
  ],
  general: [
    "✅ Experienced & Qualified Faculty",
    "✅ Digital Library Access",
    "✅ Wi-Fi Campus",
    "✅ Modern Classrooms",
    "✅ Scholarship for Meritorious Students",
    "✅ Extra-curricular Activities",
    "✅ Sports Facilities",
    "✅ Transportation Available",
    "✅ Hostel Accommodation",
    "✅ Medical Facility",
    "✅ 24/7 Security",
    "✅ Career Counseling Cell",
    "✅ Soft Skills Training",
    "✅ Alumni Network Support"
  ]
};

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    collegeId: '',
    collegeName: '',
    category: 'engineering',
    duration: '4 Years',
    durationYears: 4,
    durationSemesters: 8,
    feePerYear: 0,
    totalFee: 0,
    registrationFee: 10000,
    semesterFee: 0,
    seats: 60,
    university: '',
    eligibility: '',
    examAccepted: '',
    affiliation: '',
    specializations: [] as string[],
    highlights: [] as string[],
    isActive: true
  });

  const [specializationInput, setSpecializationInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [selectedEligibilityTemplate, setSelectedEligibilityTemplate] = useState('');
  const [selectedUniversityTemplate, setSelectedUniversityTemplate] = useState('');
  const [selectedAffiliationTemplate, setSelectedAffiliationTemplate] = useState('');
  const [selectedExamAcceptedTemplate, setSelectedExamAcceptedTemplate] = useState('');

  // Auto load highlights when category changes
  useEffect(() => {
    if (!editingCourse && formData.category) {
      const categoryHighlights = highlightsByCategory[formData.category] || highlightsByCategory.general;
      setFormData(prev => ({ ...prev, highlights: [...categoryHighlights] }));
    }
  }, [formData.category, editingCourse]);

  // Auto calculate total fee
  useEffect(() => {
    if (formData.feePerYear && formData.durationYears) {
      const total = formData.feePerYear * formData.durationYears;
      const semesterFeeValue = Math.round(formData.feePerYear / 2);
      setFormData(prev => ({ 
        ...prev, 
        totalFee: total,
        semesterFee: semesterFeeValue
      }));
    }
  }, [formData.feePerYear, formData.durationYears]);

  // Auto calculate semesters
  useEffect(() => {
    if (formData.durationYears) {
      setFormData(prev => ({ ...prev, durationSemesters: formData.durationYears * 2 }));
    }
  }, [formData.durationYears]);

  useEffect(() => {
    fetchColleges();
    fetchCourses();
  }, []);

  const fetchColleges = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'colleges'));
      const list: College[] = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, name: doc.data().name }));
      setColleges(list);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
      const list: Course[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ 
          id: doc.id, 
          name: data.name || '',
          collegeId: data.collegeId || '',
          collegeName: data.collegeName || '',
          category: data.category || 'general',
          duration: data.duration || '',
          durationYears: data.durationYears || 4,
          durationSemesters: data.durationSemesters || 8,
          feePerYear: typeof data.feePerYear === 'number' ? data.feePerYear : 0,
          totalFee: typeof data.totalFee === 'number' ? data.totalFee : 0,
          registrationFee: typeof data.registrationFee === 'number' ? data.registrationFee : 10000,
          semesterFee: typeof data.semesterFee === 'number' ? data.semesterFee : 0,
          seats: typeof data.seats === 'number' ? data.seats : 60,
          university: data.university || '',
          eligibility: data.eligibility || '',
          examAccepted: data.examAccepted || '',
          affiliation: data.affiliation || '',
          specializations: data.specializations || [],
          highlights: data.highlights || [],
          isActive: data.isActive !== false
        });
      });
      setCourses(list);
    } catch (error) {
      showToast('Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addSpecialization = () => {
    if (specializationInput.trim()) {
      setFormData({ ...formData, specializations: [...formData.specializations, specializationInput.trim()] });
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData({ ...formData, specializations: formData.specializations.filter((_, i) => i !== index) });
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

  const loadHighlightsForCategory = (category: string) => {
    const categoryHighlights = highlightsByCategory[category] || highlightsByCategory.general;
    setFormData(prev => ({ ...prev, highlights: [...categoryHighlights] }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.collegeId) {
      showToast('Please fill course name and select college', 'error');
      return;
    }

    try {
      const selectedCollegeObj = colleges.find(c => c.id === formData.collegeId);
      
      const courseData = {
        name: formData.name,
        collegeId: formData.collegeId,
        collegeName: selectedCollegeObj?.name || '',
        category: formData.category,
        duration: formData.duration,
        durationYears: Number(formData.durationYears),
        durationSemesters: Number(formData.durationSemesters),
        feePerYear: Number(formData.feePerYear),
        totalFee: Number(formData.totalFee),
        registrationFee: Number(formData.registrationFee),
        semesterFee: Number(formData.semesterFee),
        seats: Number(formData.seats),
        university: formData.university,
        eligibility: formData.eligibility,
        examAccepted: formData.examAccepted,
        affiliation: formData.affiliation,
        specializations: formData.specializations,
        highlights: formData.highlights,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString()
      };

      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
        showToast('Course updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'courses'), { ...courseData, createdAt: new Date().toISOString() });
        showToast('Course added successfully!', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      console.error('Error:', error);
      showToast('Failed to save course: ' + error.message, 'error');
    }
  };

  const handleDelete = async (course: Course) => {
    if (confirm(`Delete "${course.name}" permanently?`)) {
      try {
        await deleteDoc(doc(db, 'courses', course.id));
        showToast('Course deleted successfully!', 'success');
        fetchCourses();
      } catch (error) {
        showToast('Failed to delete course', 'error');
      }
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name || '',
      collegeId: course.collegeId || '',
      collegeName: course.collegeName || '',
      category: course.category || 'engineering',
      duration: course.duration || '4 Years',
      durationYears: course.durationYears || 4,
      durationSemesters: course.durationSemesters || 8,
      feePerYear: typeof course.feePerYear === 'number' ? course.feePerYear : 0,
      totalFee: typeof course.totalFee === 'number' ? course.totalFee : 0,
      registrationFee: typeof course.registrationFee === 'number' ? course.registrationFee : 10000,
      semesterFee: typeof course.semesterFee === 'number' ? course.semesterFee : 0,
      seats: typeof course.seats === 'number' ? course.seats : 60,
      university: course.university || '',
      eligibility: course.eligibility || '',
      examAccepted: course.examAccepted || '',
      affiliation: course.affiliation || '',
      specializations: course.specializations || [],
      highlights: course.highlights || [],
      isActive: course.isActive !== false
    });
    setSelectedUniversityTemplate('');
    setSelectedAffiliationTemplate('');
    setSelectedEligibilityTemplate('');
    setSelectedExamAcceptedTemplate('');
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      name: '', collegeId: '', collegeName: '', category: 'engineering', duration: '4 Years',
      durationYears: 4, durationSemesters: 8, feePerYear: 0, totalFee: 0, registrationFee: 10000,
      semesterFee: 0, seats: 60, university: '', eligibility: '', examAccepted: '', affiliation: '',
      specializations: [], highlights: highlightsByCategory.engineering, isActive: true
    });
    setSpecializationInput('');
    setHighlightInput('');
    setSelectedEligibilityTemplate('');
    setSelectedUniversityTemplate('');
    setSelectedAffiliationTemplate('');
    setSelectedExamAcceptedTemplate('');
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Course Name', 'College', 'Category', 'Duration', 'Fee/Year', 'Total Fee', 'Seats', 'University', 'Exam Accepted', 'Status'];
    const data = filteredCourses.map(c => [c.id, c.name, c.collegeName, c.category, c.duration, c.feePerYear, c.totalFee, c.seats, c.university, c.examAccepted, c.isActive ? 'Active' : 'Inactive']);
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export complete!', 'success');
  };

  const filteredCourses = courses.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        c.collegeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCollege = selectedCollege ? c.collegeId === selectedCollege : true;
    return matchSearch && matchCollege;
  });

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">📚 Course Management</h2>
          <p className="text-sm text-gray-500">Complete course management with templates - University, Affiliation, Eligibility, Exam Accepted, Highlights</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Download className="w-4 h-4" /> Export CSV</button>
          <button onClick={fetchCourses} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"><RefreshCw className="w-4 h-4" /> Refresh</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
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
            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="">All Colleges</option>
            {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><Plus className="w-4 h-4" /> Add Course</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">College</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Fee/Year</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Total Fee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">University</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Exam Accepted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-500">No courses found</td>
                </tr>
              ) : (
                filteredCourses.map(course => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-purple-600" /><span className="font-medium">{course.name}</span></div></td>
                    <td className="px-4 py-3 text-sm">{course.collegeName}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">{course.category}</span></td>
                    <td className="px-4 py-3 text-sm">{course.duration}</td>
                    <td className="px-4 py-3"><span className="font-semibold text-purple-600">₹{course.feePerYear?.toLocaleString()}</span></td>
                    <td className="px-4 py-3"><span className="font-semibold text-blue-600">₹{course.totalFee?.toLocaleString()}</span></td>
                    <td className="px-4 py-3 text-sm truncate max-w-[200px]">{course.university}</td>
                    <td className="px-4 py-3 text-sm truncate max-w-[200px]">{course.examAccepted}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{course.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(course)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(course)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Course Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., B.Tech, MBA" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">College *</label>
                    <select value={formData.collegeId} onChange={(e) => { const c = colleges.find(c => c.id === e.target.value); setFormData({ ...formData, collegeId: e.target.value, collegeName: c?.name || '' }); }} className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select College</option>
                      {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Category & Duration */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => { 
                        setFormData({ ...formData, category: e.target.value });
                        loadHighlightsForCategory(e.target.value);
                      }} 
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (Years)</label>
                    <input type="number" value={formData.durationYears} onChange={(e) => setFormData({ ...formData, durationYears: parseInt(e.target.value), duration: `${parseInt(e.target.value)} Years` })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Semesters</label>
                    <input type="number" value={formData.durationSemesters} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                  </div>
                </div>

                {/* Fee Structure */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Calculator className="w-4 h-4 text-green-600" /> 💰 Fee Structure (Auto-calculated)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fee Per Year (₹)</label>
                      <input type="number" value={formData.feePerYear} onChange={(e) => setFormData({ ...formData, feePerYear: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 120000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Total Fee (₹)</label>
                      <input type="number" value={formData.totalFee} disabled className="w-full px-4 py-2 border rounded-lg bg-green-50 font-semibold text-green-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Registration Fee (₹)</label>
                      <input type="number" value={formData.registrationFee} onChange={(e) => setFormData({ ...formData, registrationFee: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-1">💡 Total Fee = Fee Per Year × Duration (Years). Auto-calculated!</p>
                </div>

                {/* UNIVERSITY with Template Dropdown */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><University className="w-4 h-4 text-blue-600" /> 🏛️ University Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select University Template</label>
                      <select 
                        value={selectedUniversityTemplate} 
                        onChange={(e) => {
                          setSelectedUniversityTemplate(e.target.value);
                          setFormData({ ...formData, university: e.target.value });
                        }} 
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                      >
                        <option value="">-- Select University Template --</option>
                        {universityTemplates.map((t, i) => <option key={i} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">OR Type Custom University</label>
                      <input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} placeholder="e.g., Your Own University Name" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* EXAM ACCEPTED with Template Dropdown - NEW */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-600" /> 📝 Exam Accepted</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Exam Accepted Template</label>
                      <select 
                        value={selectedExamAcceptedTemplate} 
                        onChange={(e) => {
                          setSelectedExamAcceptedTemplate(e.target.value);
                          setFormData({ ...formData, examAccepted: e.target.value });
                        }} 
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                      >
                        <option value="">-- Select Exam Template --</option>
                        {examAcceptedTemplates.map((t, i) => <option key={i} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">OR Type Custom Exam Accepted</label>
                      <input type="text" value={formData.examAccepted} onChange={(e) => setFormData({ ...formData, examAccepted: e.target.value })} placeholder="e.g., JEE Main, CUET, CAT" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* AFFILIATION with Template Dropdown */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-600" /> ✓ Affiliation & Accreditation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Affiliation Template</label>
                      <select 
                        value={selectedAffiliationTemplate} 
                        onChange={(e) => {
                          setSelectedAffiliationTemplate(e.target.value);
                          setFormData({ ...formData, affiliation: e.target.value });
                        }} 
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                      >
                        <option value="">-- Select Affiliation Template --</option>
                        {affiliationTemplates.map((t, i) => <option key={i} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">OR Type Custom Affiliation</label>
                      <input type="text" value={formData.affiliation} onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })} placeholder="e.g., Your Own Affiliation" className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Eligibility with Template */}
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-red-600" /> 📋 Eligibility Criteria</label>
                  <select 
                    value={selectedEligibilityTemplate} 
                    onChange={(e) => {
                      setSelectedEligibilityTemplate(e.target.value);
                      setFormData({ ...formData, eligibility: e.target.value });
                    }} 
                    className="w-full px-4 py-2 border rounded-lg mb-2 bg-gray-50"
                  >
                    <option value="">-- Select Eligibility Template --</option>
                    {eligibilityTemplates.map((t, i) => <option key={i} value={t.value}>{t.label}</option>)}
                  </select>
                  <textarea value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })} rows={2} className="w-full px-4 py-2 border rounded-lg" placeholder="OR type custom eligibility criteria..." />
                </div>

                {/* Seats & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">🎓 Total Seats</label>
                    <input type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="flex items-center gap-3 mt-7">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                    <label className="text-sm font-medium">✅ Course Active (show on website)</label>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-600" /> ⭐ Specializations</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={specializationInput} onChange={(e) => setSpecializationInput(e.target.value)} placeholder="Add specialization" className="flex-1 px-4 py-2 border rounded-lg" onKeyPress={(e) => e.key === 'Enter' && addSpecialization()} />
                    <button onClick={addSpecialization} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {s}<button onClick={() => removeSpecialization(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights with Category Auto-Load */}
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600" /> 🔥 Course Highlights</label>
                  <p className="text-xs text-blue-500 mb-2">💡 Highlights auto-loaded based on selected category! You can add/remove as needed.</p>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Add highlight" className="flex-1 px-4 py-2 border rounded-lg" onKeyPress={(e) => e.key === 'Enter' && addHighlight()} />
                    <button onClick={addHighlight} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {h}<button onClick={() => removeHighlight(i)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={handleSubmit} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {editingCourse ? 'Update Course' : 'Add Course'}
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200">
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