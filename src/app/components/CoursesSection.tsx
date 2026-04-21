import { motion } from 'motion/react';
import { Code, Stethoscope, GraduationCap, Database, Briefcase, BookOpen, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Course {
  icon: any;
  title: string;
  description: string;
  image: string;
  gradient: string;
  color: string;
  filterKey: string;
}

interface CoursesSectionProps {
  onCourseClick?: (courseTitle: string) => void;
  onNavigateToCourses?: () => void;
}

const courses: Course[] = [
  {
    icon: Code,
    title: 'Engineering',
    description: 'B.Tech, B.E. in CS, Mechanical, Electrical & more',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800',
    gradient: 'from-blue-500 to-cyan-500',
    color: '#3B82F6',
    filterKey: 'engineering-colleges',
  },
  {
    icon: Stethoscope,
    title: 'Medical',
    description: 'MBBS, BDS, BAMS, BHMS courses',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    gradient: 'from-red-500 to-pink-500',
    color: '#EF4444',
    filterKey: 'medical-colleges',
  },
  {
    icon: GraduationCap,
    title: 'Nursing',
    description: 'B.Sc Nursing, GNM, Post Basic courses',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800',
    gradient: 'from-pink-500 to-rose-500',
    color: '#EC4899',
    filterKey: 'nursing-colleges',
  },
  {
    icon: Database,
    title: 'Pharmacy',
    description: 'B.Pharma, D.Pharma, Pharm.D',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    gradient: 'from-green-500 to-emerald-500',
    color: '#10B981',
    filterKey: 'pharmacy-colleges',
  },
  {
    icon: Briefcase,
    title: 'Management',
    description: 'BBA, MBA, Hotel Management',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    gradient: 'from-purple-500 to-indigo-500',
    color: '#8B5CF6',
    filterKey: 'mba-colleges',
  },
  {
    icon: BookOpen,
    title: 'IT & Computer',
    description: 'BCA, MCA, B.Sc IT, Data Science',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    gradient: 'from-indigo-500 to-blue-500',
    color: '#6366F1',
    filterKey: 'bca-colleges',
  },
];

export function CoursesSection({ onCourseClick, onNavigateToCourses }: CoursesSectionProps) {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Only animate once when component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1, once: true }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const handleCourseClick = (course: Course) => {
    // Direct navigation to filtered colleges page
    const filterPage = `/${course.filterKey}`;
    console.log(`🎯 Course clicked: ${course.title} → Navigating to: ${filterPage}`);
    
    // Navigate to the specific colleges page
    navigate(filterPage);
    
    // Also call parent handlers if provided (for backward compatibility)
    if (onNavigateToCourses) {
      onNavigateToCourses();
    }
    
    if (onCourseClick) {
      onCourseClick(course.title);
    }
  };

  const handleViewAllCourses = () => {
    if (onNavigateToCourses) {
      onNavigateToCourses();
    } else {
      navigate('/courses');
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            Popular Courses
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Career Paths
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from 500+ verified colleges across India
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const Icon = course.icon;
            const isHovered = hoveredCourse === course.title;

            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -8 }}
                onMouseEnter={() => setHoveredCourse(course.title)}
                onMouseLeave={() => setHoveredCourse(null)}
                onClick={() => handleCourseClick(course)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-[0.98] will-change-transform"
                style={{ transform: 'translateZ(0)' }}
              >
                {/* Image section */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Subtle Color Overlay */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${course.gradient}`}
                    style={{ 
                      opacity: isHovered ? 0.25 : 0.2,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none'
                    }}
                  />
                  
                  {/* Icon Badge */}
                  <motion.div 
                    className="absolute top-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ pointerEvents: 'none' }}
                  >
                    <Icon className="w-6 h-6 text-gray-900" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 font-semibold">
                    <span>Explore {course.title} Colleges</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Courses Button */}
        <div className="text-center mt-16">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewAllCourses}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <p className="text-gray-500 text-sm mt-4">
            Click any course card to see filtered colleges
          </p>
        </div>
      </div>
    </section>
  );
}