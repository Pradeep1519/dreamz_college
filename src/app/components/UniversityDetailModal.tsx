// src/app/components/UniversityDetailModal.tsx

import { motion, AnimatePresence } from 'motion/react';
import { X, GraduationCap, MapPin, Calendar, Trophy, Users, BookOpen, Globe, Mail, Phone, Star, Award, ExternalLink, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface University {
  id: string;
  name: string;
  fullName: string;
  established: string;
  location: string;
  nirfRank: string;
  type: string;
  affiliatedColleges: number;
  courses: string[];
  website: string;
  email: string;
  phone: string;
  description: string;
  achievements: string[];
  logo: string;
}

interface UniversityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University | null;
}

const universitiesData: Record<string, University> = {
  'aktu': {
    id: 'aktu',
    name: 'AKTU',
    fullName: 'Dr. A.P.J. Abdul Kalam Technical University',
    established: '2000',
    location: 'Lucknow, Uttar Pradesh',
    nirfRank: '151-200',
    type: 'State University',
    affiliatedColleges: 750,
    courses: ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'B.Pharm', 'M.Pharm', 'B.Arch', 'BBA', 'BCA'],
    website: 'https://aktu.ac.in',
    email: 'info@aktu.ac.in',
    phone: '+91-522-1234567',
    description: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU), formerly Uttar Pradesh Technical University (UPTU), is a public university in Lucknow, Uttar Pradesh. It was established in 2000 by the Government of Uttar Pradesh to promote technical education in the state.',
    achievements: [
      'Ranked 151-200 in NIRF Engineering Category',
      'Over 750 affiliated colleges across Uttar Pradesh',
      'Recognized by UGC and AICTE',
      'State\'s largest technical university'
    ],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/Dr._A.P.J._Abdul_Kalam_Technical_University_logo.png/200px-Dr._A.P.J._Abdul_Kalam_Technical_University_logo.png'
  },
  'ccsu': {
    id: 'ccsu',
    name: 'CCSU',
    fullName: 'Chaudhary Charan Singh University',
    established: '1965',
    location: 'Meerut, Uttar Pradesh',
    nirfRank: '101-150',
    type: 'State University',
    affiliatedColleges: 800,
    courses: ['BA', 'B.Com', 'B.Sc', 'BBA', 'BCA', 'MA', 'M.Com', 'M.Sc', 'MBA', 'LL.B'],
    website: 'https://ccsuniversity.ac.in',
    email: 'info@ccsuniversity.ac.in',
    phone: '+91-121-1234567',
    description: 'Chaudhary Charan Singh University (CCSU), formerly Meerut University, is a public university in Meerut, Uttar Pradesh. It was established in 1965 and is named after India\'s former Prime Minister, Chaudhary Charan Singh.',
    achievements: [
      'NAAC A+ Grade',
      'Ranked 101-150 in NIRF University Category',
      'Over 800 affiliated colleges',
      'Recognized by UGC'
    ],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Chaudhary_Charan_Singh_University_logo.png/200px-Chaudhary_Charan_Singh_University_logo.png'
  },
  'ggsipu': {
    id: 'ggsipu',
    name: 'GGSIPU',
    fullName: 'Guru Gobind Singh Indraprastha University',
    established: '1998',
    location: 'Delhi',
    nirfRank: '85',
    type: 'State University',
    affiliatedColleges: 120,
    courses: ['B.Tech', 'MBA', 'BBA', 'BCA', 'B.Com', 'LL.B', 'B.Arch', 'MCA', 'M.Tech', 'M.Com'],
    website: 'https://ipu.ac.in',
    email: 'info@ipu.ac.in',
    phone: '+91-11-12345678',
    description: 'Guru Gobind Singh Indraprastha University (GGSIPU) is a public university located in Delhi, India. It was established in 1998 and is named after the tenth Sikh Guru, Guru Gobind Singh.',
    achievements: [
      'NAAC A+ Grade',
      'Ranked 85 in NIRF University Category',
      'Recognized by UGC and AICTE',
      'One of Delhi\'s premier universities'
    ],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Guru_Gobind_Singh_Indraprastha_University_logo.png/200px-Guru_Gobind_Singh_Indraprastha_University_logo.png'
  },
  'upbte': {
    id: 'upbte',
    name: 'UPBTE',
    fullName: 'Uttar Pradesh Board of Technical Education',
    established: '1958',
    location: 'Lucknow, Uttar Pradesh',
    nirfRank: 'N/A',
    type: 'Board',
    affiliatedColleges: 400,
    courses: ['Diploma in Engineering', 'Diploma in Pharmacy', 'Diploma in Management', 'Post Diploma Courses'],
    website: 'https://bteup.ac.in',
    email: 'info@bteup.ac.in',
    phone: '+91-522-1234567',
    description: 'Uttar Pradesh Board of Technical Education (UPBTE) is a board of technical education in Uttar Pradesh, India. It was established in 1958 and is responsible for conducting examinations and providing affiliation to polytechnic institutions in the state.',
    achievements: [
      'Over 400 affiliated polytechnic colleges',
      'Conducts JEECUP examination annually',
      'Recognized by AICTE',
      'One of India\'s largest technical boards'
    ],
    logo: 'https://bteup.ac.in/images/logo.png'
  }
};

export function UniversityDetailModal({ isOpen, onClose, university }: UniversityDetailModalProps) {
  const { user, userData } = useAuth();
  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest';

  if (!isOpen || !university) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 rounded-2xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="sticky top-4 right-4 float-right z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="clear-both px-6 pb-6 pt-2">
              {/* Greeting */}
              <div className="mb-6 mt-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    <span className="text-lg font-semibold text-gray-800">
                      Namaste, {userName}!
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    You're exploring <span className="font-semibold text-purple-600">{university.fullName}</span>
                  </p>
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src={university.logo} alt={university.name} className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{university.name}</h1>
                  <p className="text-sm text-gray-500">{university.fullName}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Established</p>
                  <p className="text-sm font-semibold text-gray-900">{university.established}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <MapPin className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{university.location}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">NIRF Rank</p>
                  <p className="text-sm font-semibold text-gray-900">{university.nirfRank}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Affiliated Colleges</p>
                  <p className="text-sm font-semibold text-gray-900">{university.affiliatedColleges}+</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About University</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{university.description}</p>
              </div>

              {/* Courses */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Courses Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {university.courses.map((course, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Achievements</h3>
                <div className="space-y-2">
                  {university.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      {university.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${university.email}`} className="text-gray-600">{university.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{university.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-center flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Official Website
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}