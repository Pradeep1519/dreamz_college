import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Download, ExternalLink,
  BookOpen, FileText, Award, Users, TrendingUp,
  Search, Filter, ChevronRight, Globe, X,
  GraduationCap, AlertCircle, CheckCircle, HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Exam {
  id: string;
  name: string;
  fullName: string;
  category: 'Engineering' | 'Medical' | 'Management' | 'Civil Services' | 'Law' | 'Other';
  level: 'National' | 'State' | 'University';
  conductingBody: string;
  website: string;
  applicationDate: string;
  examDate: string;
  resultDate?: string;
  eligibility: string[];
  syllabus: string[];
  pattern: string;
  totalMarks: string;
  duration: string;
  fees: string;
  officialSite: string;
  previousPapers: {
    year: string;
    pdfLink: string;
  }[];
  featured?: boolean;
}

const exams: Exam[] = [
  {
    id: 'jee-main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination (Main)',
    category: 'Engineering',
    level: 'National',
    conductingBody: 'NTA (National Testing Agency)',
    website: 'https://jeemain.nta.nic.in',
    applicationDate: 'March 2026',
    examDate: 'May 2026',
    resultDate: 'June 2026',
    eligibility: [
      '10+2 with Physics, Chemistry, Mathematics',
      'Minimum 75% marks (65% for SC/ST)',
      'Year of passing: 2024, 2025 or appearing in 2026'
    ],
    syllabus: [
      'Physics: Mechanics, Electrodynamics, Optics, Modern Physics',
      'Chemistry: Physical, Organic, Inorganic Chemistry',
      'Mathematics: Algebra, Calculus, Coordinate Geometry, Trigonometry'
    ],
    pattern: 'Computer Based Test (CBT)',
    totalMarks: '300 marks (3 hours)',
    duration: '3 hours',
    fees: '₹650 (General), ₹325 (SC/ST)',
    officialSite: 'https://jeemain.nta.nic.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/jee-main-2025.pdf' },
      { year: '2024', pdfLink: '/papers/jee-main-2024.pdf' },
      { year: '2023', pdfLink: '/papers/jee-main-2023.pdf' }
    ],
    featured: true
  },
  {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    fullName: 'Joint Entrance Examination (Advanced)',
    category: 'Engineering',
    level: 'National',
    conductingBody: 'IITs (Rotating Basis)',
    website: 'https://jeeadv.ac.in',
    applicationDate: 'April 2026',
    examDate: 'June 2026',
    resultDate: 'June 2026',
    eligibility: [
      'Top 2.5 lakh rankers of JEE Main',
      '10+2 with Physics, Chemistry, Mathematics',
      '75% marks in 12th (65% for SC/ST)'
    ],
    syllabus: [
      'Physics: Advanced topics in Mechanics, Electricity, Magnetism',
      'Chemistry: Physical, Organic, Inorganic with advanced concepts',
      'Mathematics: Advanced Calculus, Algebra, Geometry'
    ],
    pattern: 'Computer Based Test (CBT)',
    totalMarks: '360 marks (6 hours in two papers)',
    duration: '3 hours each paper',
    fees: '₹2800 (General), ₹1400 (SC/ST)',
    officialSite: 'https://jeeadv.ac.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/jee-advanced-2025.pdf' },
      { year: '2024', pdfLink: '/papers/jee-advanced-2024.pdf' }
    ],
    featured: true
  },
  {
    id: 'bitsat',
    name: 'BITSAT',
    fullName: 'BITS Admission Test',
    category: 'Engineering',
    level: 'University',
    conductingBody: 'BITS Pilani',
    website: 'https://bitsadmission.com',
    applicationDate: 'January 2026',
    examDate: 'May-June 2026',
    resultDate: 'July 2026',
    eligibility: [
      '10+2 with Physics, Chemistry, Mathematics',
      'Minimum 75% marks in PCM',
      '60% marks in each subject'
    ],
    syllabus: [
      'Physics: 11th and 12th NCERT syllabus',
      'Chemistry: 11th and 12th NCERT syllabus',
      'Mathematics: 11th and 12th NCERT syllabus',
      'English Proficiency and Logical Reasoning'
    ],
    pattern: 'Computer Based Test (CBT)',
    totalMarks: '450 marks (3 hours)',
    duration: '3 hours',
    fees: '₹3400 (Male), ₹2900 (Female)',
    officialSite: 'https://bitsadmission.com',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/bitsat-2025.pdf' },
      { year: '2024', pdfLink: '/papers/bitsat-2024.pdf' }
    ]
  },
  {
    id: 'gate',
    name: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    category: 'Engineering',
    level: 'National',
    conductingBody: 'IITs and IISc',
    website: 'https://gate.iitm.ac.in',
    applicationDate: 'September 2025',
    examDate: 'February 2026',
    resultDate: 'March 2026',
    eligibility: [
      'Bachelor\'s degree in Engineering/Technology',
      'Master\'s degree in Science/Computer Science',
      'Final year students can also apply'
    ],
    syllabus: [
      'Core Engineering subjects as per chosen paper',
      'General Aptitude (15% weightage)',
      'Engineering Mathematics (15% weightage)'
    ],
    pattern: 'Computer Based Test (CBT)',
    totalMarks: '100 marks (3 hours)',
    duration: '3 hours',
    fees: '₹1500 (General), ₹750 (SC/ST)',
    officialSite: 'https://gate.iitm.ac.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/gate-2025.pdf' },
      { year: '2024', pdfLink: '/papers/gate-2024.pdf' },
      { year: '2023', pdfLink: '/papers/gate-2023.pdf' }
    ]
  },
  {
    id: 'neet-ug',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
    category: 'Medical',
    level: 'National',
    conductingBody: 'NTA',
    website: 'https://neet.nta.nic.in',
    applicationDate: 'February 2026',
    examDate: 'May 2026',
    resultDate: 'June 2026',
    eligibility: [
      '10+2 with Physics, Chemistry, Biology',
      'Minimum 50% marks (40% for SC/ST)',
      'Age: 17 years as on December 31, 2026'
    ],
    syllabus: [
      'Physics: 11th and 12th NCERT syllabus',
      'Chemistry: 11th and 12th NCERT syllabus',
      'Biology: 11th and 12th NCERT syllabus (Botany + Zoology)'
    ],
    pattern: 'Pen and Paper (OMR)',
    totalMarks: '720 marks (3 hours 20 minutes)',
    duration: '200 minutes',
    fees: '₹1500 (General), ₹800 (SC/ST)',
    officialSite: 'https://neet.nta.nic.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/neet-2025.pdf' },
      { year: '2024', pdfLink: '/papers/neet-2024.pdf' },
      { year: '2023', pdfLink: '/papers/neet-2023.pdf' }
    ],
    featured: true
  },
  {
    id: 'neet-pg',
    name: 'NEET PG',
    fullName: 'National Eligibility cum Entrance Test (Postgraduate)',
    category: 'Medical',
    level: 'National',
    conductingBody: 'NBE',
    website: 'https://nbe.edu.in',
    applicationDate: 'January 2026',
    examDate: 'March 2026',
    resultDate: 'April 2026',
    eligibility: [
      'MBBS degree from recognized institution',
      'Completed/permanent registration with MCI'
    ],
    syllabus: [
      'Pre-Clinical Subjects: Anatomy, Physiology, Biochemistry',
      'Para-Clinical Subjects: Pharmacology, Microbiology, Pathology',
      'Clinical Subjects: Medicine, Surgery, Pediatrics, OBG'
    ],
    pattern: 'Computer Based Test (CBT)',
    totalMarks: '1200 marks (3.5 hours)',
    duration: '210 minutes',
    fees: '₹3500 (General), ₹2500 (SC/ST)',
    officialSite: 'https://nbe.edu.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/neet-pg-2025.pdf' },
      { year: '2024', pdfLink: '/papers/neet-pg-2024.pdf' }
    ]
  },
  {
    id: 'cat',
    name: 'CAT',
    fullName: 'Common Admission Test',
    category: 'Management',
    level: 'National',
    conductingBody: 'IIMs (Rotating)',
    website: 'https://iimcat.ac.in',
    applicationDate: 'August 2025',
    examDate: 'November 2025',
    resultDate: 'January 2026',
    eligibility: [
      'Bachelor\'s degree with minimum 50% marks',
      'Final year students can apply',
      'No age limit'
    ],
    syllabus: [
      'Verbal Ability and Reading Comprehension',
      'Data Interpretation and Logical Reasoning',
      'Quantitative Aptitude'
    ],
    pattern: 'Computer Based Test (CBT)',
    totalMarks: '198 marks (2 hours)',
    duration: '120 minutes',
    fees: '₹2200 (General), ₹1100 (SC/ST)',
    officialSite: 'https://iimcat.ac.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/cat-2025.pdf' },
      { year: '2024', pdfLink: '/papers/cat-2024.pdf' }
    ],
    featured: true
  },
  {
    id: 'mat',
    name: 'MAT',
    fullName: 'Management Aptitude Test',
    category: 'Management',
    level: 'National',
    conductingBody: 'AIMA',
    website: 'https://mat.aima.in',
    applicationDate: 'February 2026',
    examDate: 'March 2026',
    resultDate: 'April 2026',
    eligibility: [
      'Bachelor\'s degree in any discipline',
      'Final year students can apply'
    ],
    syllabus: [
      'Intelligence and Critical Reasoning',
      'Mathematical Skills',
      'Data Analysis and Sufficiency',
      'Language Comprehension',
      'Indian and Global Environment'
    ],
    pattern: 'Computer Based Test (CBT) and Paper Based',
    totalMarks: '200 marks (2.5 hours)',
    duration: '150 minutes',
    fees: '₹1750 (General), ₹1250 (SC/ST)',
    officialSite: 'https://mat.aima.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/mat-2025.pdf' },
      { year: '2024', pdfLink: '/papers/mat-2024.pdf' }
    ]
  },
  {
    id: 'upsc-cse',
    name: 'UPSC CSE',
    fullName: 'UPSC Civil Services Examination',
    category: 'Civil Services',
    level: 'National',
    conductingBody: 'UPSC',
    website: 'https://upsc.gov.in',
    applicationDate: 'February 2026',
    examDate: 'May 2026 (Prelims), September 2026 (Mains)',
    resultDate: 'December 2026',
    eligibility: [
      'Bachelor\'s degree from recognized university',
      'Age: 21-32 years (relaxation for SC/ST/OBC)',
      'Number of attempts: 6 (General), 9 (OBC), unlimited (SC/ST)'
    ],
    syllabus: [
      'Prelims: General Studies I and CSAT',
      'Mains: Essay, GS I, II, III, IV, Optional Subject',
      'Interview/Personality Test'
    ],
    pattern: 'Three stages: Prelims (MCQ), Mains (Descriptive), Interview',
    totalMarks: '2025 marks (Prelims 400, Mains 1750, Interview 275)',
    duration: 'Year-long process',
    fees: '₹100 (General), No fee for SC/ST',
    officialSite: 'https://upsc.gov.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/upsc-2025.pdf' },
      { year: '2024', pdfLink: '/papers/upsc-2024.pdf' }
    ],
    featured: true
  },
  {
    id: 'upsc-ifs',
    name: 'UPSC IFS',
    fullName: 'Indian Forest Service Examination',
    category: 'Civil Services',
    level: 'National',
    conductingBody: 'UPSC',
    website: 'https://upsc.gov.in',
    applicationDate: 'February 2026',
    examDate: 'May 2026 (Prelims), November 2026 (Mains)',
    resultDate: 'January 2027',
    eligibility: [
      'Bachelor\'s degree with at least one of the subjects: Animal Husbandry, Botany, Chemistry, Geology, Mathematics, Physics, Statistics, Zoology',
      'Age: 21-32 years'
    ],
    syllabus: [
      'Prelims: General Studies and Optional subject',
      'Mains: 6 papers including optional subjects',
      'Personality Test'
    ],
    pattern: 'Three stages similar to CSE',
    totalMarks: '1400 marks (approx)',
    duration: 'Year-long process',
    fees: '₹100 (General)',
    officialSite: 'https://upsc.gov.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/upsc-ifs-2025.pdf' },
      { year: '2024', pdfLink: '/papers/upsc-ifs-2024.pdf' }
    ]
  },
  {
    id: 'clat',
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    category: 'Law',
    level: 'National',
    conductingBody: 'Consortium of NLUs',
    website: 'https://consortiumofnlus.ac.in',
    applicationDate: 'January 2026',
    examDate: 'May 2026',
    resultDate: 'June 2026',
    eligibility: [
      '10+2 with minimum 45% marks (40% for SC/ST)',
      'No age limit'
    ],
    syllabus: [
      'English including Comprehension',
      'Current Affairs including General Knowledge',
      'Legal Reasoning',
      'Logical Reasoning',
      'Quantitative Techniques'
    ],
    pattern: 'Pen and Paper',
    totalMarks: '150 marks (2 hours)',
    duration: '120 minutes',
    fees: '₹4000 (General), ₹3500 (SC/ST)',
    officialSite: 'https://consortiumofnlus.ac.in',
    previousPapers: [
      { year: '2025', pdfLink: '/papers/clat-2025.pdf' },
      { year: '2024', pdfLink: '/papers/clat-2024.pdf' }
    ]
  }
];

const ExamDetailsPopup = ({ exam, onClose }: { exam: Exam | null; onClose: () => void }) => {
  if (!exam) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white sticky top-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{exam.name}</h2>
              <p className="text-white/90 mt-1">{exam.fullName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-6 h-6" /></button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Exam Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Category:</span><span className="font-medium text-purple-600">{exam.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Level:</span><span className="font-medium">{exam.level}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Conducting Body:</span><span className="font-medium">{exam.conductingBody}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Important Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600" /><span className="text-gray-600">Application:</span><span className="font-medium ml-auto">{exam.applicationDate}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600" /><span className="text-gray-600">Exam Date:</span><span className="font-medium ml-auto">{exam.examDate}</span></div>
                  {exam.resultDate && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600" /><span className="text-gray-600">Result:</span><span className="font-medium ml-auto">{exam.resultDate}</span></div>}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
                <ul className="space-y-2">
                  {exam.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Exam Pattern</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Pattern:</span><span className="font-medium">{exam.pattern}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Total Marks:</span><span className="font-medium">{exam.totalMarks}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Duration:</span><span className="font-medium">{exam.duration}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Application Fee:</span><span className="font-medium">{exam.fees}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Syllabus Overview</h3>
                <ul className="space-y-2">
                  {exam.syllabus.slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><BookOpen className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Previous Year Papers</h3>
                <div className="grid grid-cols-2 gap-2">
                  {exam.previousPapers.map((paper, i) => (
                    <a key={i} href={paper.pdfLink} download className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-purple-50 transition-colors"><Download className="w-4 h-4 text-purple-600" /><span className="text-xs">{paper.year}</span></a>
                  ))}
                </div>
              </div>
              <a href={exam.officialSite} target="_blank" rel="noopener noreferrer" className="block bg-purple-600 text-white text-center p-3 rounded-xl hover:bg-purple-700 transition-colors"><span className="flex items-center justify-center gap-2"><Globe className="w-4 h-4" /> Visit Official Website</span></a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function ExamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const categories = ['All', 'Engineering', 'Medical', 'Management', 'Civil Services', 'Law', 'Other'];
  const levels = ['All', 'National', 'State', 'University'];

  const featuredExams = exams.filter(exam => exam.featured);
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.conductingBody.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exam.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || exam.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleExamClick = (exam: Exam) => {
    setSelectedExam(exam);
  };

  const handleClosePopup = () => {
    setSelectedExam(null);
  };

  return (
    <>
      <Helmet>
        <title>JEE Main, NEET, CAT 2026 Exam Dates, Syllabus, Cutoff | Dreamz College</title>
        <meta name="description" content="Complete guide for JEE Main 2026, NEET UG 2026, CAT 2026, GATE 2026, UPSC CSE 2026. Get exam dates, syllabus, eligibility criteria, previous year papers. Free counseling for college admissions!" />
        <meta name="keywords" content="jee main 2026, neet 2026, cat 2026, gate 2026, upsc 2026, exam dates, syllabus, cutoff, competitive exams india" />
      </Helmet>
      <div className="space-y-8 pt-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Competitive Exams 2026</h1>
          <p className="text-lg opacity-90">Complete guide for Engineering, Medical, Civil Services & more</p>
          <p className="text-sm mt-2 opacity-75">Exam dates, syllabus, eligibility, previous papers & updates</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center"><div className="text-2xl font-bold text-purple-600">{exams.length}+</div><div className="text-xs text-gray-500">Exams</div></div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center"><div className="text-2xl font-bold text-blue-600">5+</div><div className="text-xs text-gray-500">Categories</div></div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center"><div className="text-2xl font-bold text-green-600">50+</div><div className="text-xs text-gray-500">Previous Papers</div></div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center"><div className="text-2xl font-bold text-orange-600">2026</div><div className="text-xs text-gray-500">Latest Updates</div></div>
        </div>

        {featuredExams.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-purple-600" /> Featured Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredExams.map(exam => (
                <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => handleExamClick(exam)} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3"><div><h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3><p className="text-sm text-gray-600 line-clamp-1">{exam.fullName}</p></div><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{exam.category}</span></div>
                  <div className="space-y-2 mb-4 text-sm"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /><span>Exam: {exam.examDate}</span></div><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500" /><span>Application: {exam.applicationDate}</span></div></div>
                  <button onClick={(e) => { e.stopPropagation(); handleExamClick(exam); }} className="w-full text-purple-600 font-medium text-sm flex items-center justify-center gap-1 hover:text-purple-700">View Details <ChevronRight className="w-4 h-4" /></button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search exams by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">{categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">{levels.map(level => (<option key={level} value={level}>{level}</option>))}</select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam, index) => (
            <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => handleExamClick(exam)} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3"><h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{exam.level}</span></div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exam.fullName}</p>
                <div className="space-y-2 mb-3"><div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-gray-500" /><span className="text-gray-600">Exam: <span className="font-medium">{exam.examDate}</span></span></div><div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-gray-500" /><span className="text-gray-600">Apply by: <span className="font-medium">{exam.applicationDate}</span></span></div></div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100"><span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">{exam.category}</span><button onClick={(e) => { e.stopPropagation(); handleExamClick(exam); }} className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">View Details <ChevronRight className="w-4 h-4" /></button></div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-600" /> Previous Year Papers (Free Download)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/papers/jee-main-2025.pdf" download className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"><Download className="w-4 h-4 text-purple-600" /><span className="text-sm">JEE Main 2025</span></a>
            <a href="/papers/neet-2025.pdf" download className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"><Download className="w-4 h-4 text-purple-600" /><span className="text-sm">NEET 2025</span></a>
            <a href="/papers/gate-2025.pdf" download className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"><Download className="w-4 h-4 text-purple-600" /><span className="text-sm">GATE 2025</span></a>
            <a href="/papers/upsc-2025.pdf" download className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"><Download className="w-4 h-4 text-purple-600" /><span className="text-sm">UPSC 2025</span></a>
          </div>
        </div>

        <AnimatePresence>
          {selectedExam && <ExamDetailsPopup exam={selectedExam} onClose={handleClosePopup} />}
        </AnimatePresence>
      </div>
    </>
  );
}