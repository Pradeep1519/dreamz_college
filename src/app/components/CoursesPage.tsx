import { Helmet } from 'react-helmet-async';
import { GraduationCap, BookOpen, Code, Stethoscope, Briefcase, Database, ArrowRight, Users, TrendingUp, Award, Clock, Scale, Landmark, Library, FlaskRound as Flask, Microscope, Gavel, Tooth, Pill as Pharmacy, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Course {
  icon: any;
  title: string;
  description: string;
  colleges: string;
  color: string;
  bgColor: string;
  category: string;
  duration: string;
  popularColleges: string[];
  avgPackage: string;
}

const courses: Course[] = [
  {
    icon: Code,
    title: 'Engineering',
    description: 'B.Tech, B.E. in Computer Science, Mechanical, Electrical, Civil, AI & ML, Data Science',
    colleges: '9+ Colleges',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'Engineering',
    duration: '4 Years',
    popularColleges: ['GN Group', 'NIET', 'Sharda', 'Galgotias', 'ITS'],
    avgPackage: '₹6-8 LPA'
  },
  {
    icon: Stethoscope,
    title: 'Medical',
    description: 'BDS (Dental), BAMS (Ayurveda), BHMS (Homeopathy), BPT, Nursing, Allied Health Sciences',
    colleges: '1+ Colleges',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    category: 'Medical',
    duration: '4-5.5 Years',
    popularColleges: ['Sharda University'],
    avgPackage: '₹5-10 LPA'
  },
  {
    icon: GraduationCap,
    title: 'Nursing',
    description: 'B.Sc Nursing, GNM, Post Basic B.Sc Nursing, M.Sc Nursing',
    colleges: '1+ Colleges',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    category: 'Nursing',
    duration: '3-4 Years',
    popularColleges: ['Sharda University'],
    avgPackage: '₹4-6 LPA'
  },
  {
    icon: Database,
    title: 'Pharmacy',
    description: 'B.Pharma, D.Pharma, Pharm.D, M.Pharma courses',
    colleges: '6+ Colleges',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    category: 'Pharmacy',
    duration: '2-4 Years',
    popularColleges: ['GN Group', 'NIET', 'Mangalmay', 'Sharda', 'Galgotias', 'IIMT'],
    avgPackage: '₹4-7 LPA'
  },
  {
    icon: Briefcase,
    title: 'Management',
    description: 'MBA, MBA++, PGDM, BBA, Executive MBA, Hotel Management',
    colleges: '9+ Colleges',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    category: 'Management',
    duration: '2-3 Years',
    popularColleges: ['GN Group', 'Mangalmay', 'Sharda', 'Galgotias', 'NIET', 'GL Bajaj', 'IIMT', 'Lloyd', 'ITS'],
    avgPackage: '₹7-12 LPA'
  },
  {
    icon: BookOpen,
    title: 'IT & Computer',
    description: 'BCA, MCA, B.Sc IT, Diploma in IT, Full Stack Development',
    colleges: '8+ Colleges',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    category: 'IT & Computer',
    duration: '2-3 Years',
    popularColleges: ['GN Group', 'Mangalmay', 'Sharda', 'Galgotias', 'NIET', 'GL Bajaj', 'IIMT', 'Lloyd', 'ITS'],
    avgPackage: '₹5-8 LPA'
  },
  {
    icon: Scale,
    title: 'Law',
    description: 'LL.B, BA-LL.B, B.Com-LL.B, Integrated Law programs',
    colleges: '4+ Colleges',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    category: 'Law',
    duration: '3-5 Years',
    popularColleges: ['GN Group', 'Sharda', 'Galgotias', 'IIMT'],
    avgPackage: '₹4-8 LPA'
  },
  {
    icon: Library,
    title: 'Education',
    description: 'B.A.B.Ed, B.Ed, M.Ed, Teaching courses',
    colleges: '1+ Colleges',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    category: 'Education',
    duration: '2-4 Years',
    popularColleges: ['Mangalmay'],
    avgPackage: '₹3-5 LPA'
  },
  {
    icon: Landmark,
    title: 'Commerce',
    description: 'B.Com, M.Com, Accounting, Finance, Tax',
    colleges: '3+ Colleges',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    category: 'Commerce',
    duration: '3 Years',
    popularColleges: ['GN Group', 'Mangalmay', 'Sharda'],
    avgPackage: '₹3-6 LPA'
  }
];

interface CoursesPageProps {
  preSelectedCourse?: string;
  onBookCounseling?: () => void;
}

export function CoursesPage({ preSelectedCourse, onBookCounseling }: CoursesPageProps) {
  const navigate = useNavigate();

  const handleCourseClick = (category: string) => {
    navigate(`/colleges?category=${category}`);
  };

  return (
    <>
      <Helmet>
        <title>Engineering, Medical, MBA, BCA Courses in Greater Noida 2026 | Dreamz College</title>
        <meta name="description" content="Explore 50+ courses in Engineering, Medical, Management, Pharmacy, Nursing, IT & Computer. Find best colleges in Greater Noida for B.Tech, MBA, BCA, B.Pharm, Nursing. Free expert counseling available!" />
        <meta name="keywords" content="courses in greater noida, btech colleges noida, mba colleges noida, bca colleges greater noida, nursing colleges noida, pharmacy colleges noida, law colleges noida" />
      </Helmet>
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Explore Your <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dream Career</span> Path
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Choose from 9 popular streams and find the best colleges in Greater Noida & across India
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">9+</div>
            <div className="text-xs text-gray-500">Streams</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-xs text-gray-500">Courses</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">2,000+</div>
            <div className="text-xs text-gray-500">Students Placed</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">₹ 1.37 Cr</div>
            <div className="text-xs text-gray-500">Highest Package</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => handleCourseClick(course.category)}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl ${course.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${course.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {course.avgPackage}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-2">Popular in: {course.popularColleges.join(' • ')}</div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-purple-600">{course.colleges}</span>
                  <span className="text-xs text-gray-400">Click to explore →</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Not sure which course to choose?</h2>
          <p className="mb-4 opacity-90">Get free expert counseling to find your perfect career path</p>
          <button
            onClick={onBookCounseling}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Book Free Counseling
          </button>
        </motion.div>
      </div>
    </>
  );
}