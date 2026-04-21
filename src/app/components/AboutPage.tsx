import { motion } from 'motion/react';
import { Award, Users, Target, Heart, Briefcase, Sparkles, Shield } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
        >
          About Dreamz College
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Your Trusted Partner in Education
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Founded in 2015, Dreamz College has been guiding Indian students to their dream institutions with expert counseling and personalized support.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-700">
            To democratize access to quality education by providing free, transparent, and expert guidance to every Indian student aspiring for higher education.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
          </div>
          <p className="text-gray-700">
            To become India's most trusted education counseling platform, helping millions of students make informed career decisions and achieve their academic dreams.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">8+</div>
          <div className="text-sm text-gray-600">Years Experience</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
          <div className="text-sm text-gray-600">Students Guided</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">38+</div>
          <div className="text-sm text-gray-600">Colleges Partnered</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4 justify-center">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-3xl font-bold">100% Free & 100% Committed</h2>
        </div>
        <p className="text-center text-lg text-white/90 max-w-3xl mx-auto mb-8">
          Dreamz College is a subsidiary of JuniorDream Private Limited, dedicated entirely to helping students find their perfect college – absolutely free of cost.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">100% Placement Assistance</h3>
              <p className="text-white/80 text-sm">We guarantee that every student who comes to us will get internship and placement opportunities with our partner companies.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">100% Free Service</h3>
              <p className="text-white/80 text-sm">No hidden costs, no fees – ever. Our mission is to help students, not to profit from them.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
            <p className="text-gray-600">We strive for excellence in every counseling session and guidance provided.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Student First</h3>
            <p className="text-gray-600">Every decision we make prioritizes the student's best interest and future.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
            <p className="text-gray-600">We maintain complete transparency and honesty in all our interactions.</p>
          </div>
        </div>
      </div>

      {/* Team Info */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About JuniorDream Pvt Ltd</h2>
        <p className="text-gray-700 mb-4 text-lg">
          Dreamz College is a proud subsidiary of <span className="font-semibold text-purple-600">JuniorDream Private Limited</span>, a registered education counseling company committed to helping students achieve their academic goals.
        </p>
        <p className="text-gray-700 mb-6">
          We are headquartered in New Delhi with a team of 50+ experienced education counselors. Our mission is simple: <span className="font-semibold">to help every Indian student find their dream college – completely free of cost.</span> We guarantee 100% placement and internship assistance to every student who comes to us.
        </p>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Promise to Students:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><span className="font-semibold">100% Free Service</span> – No hidden charges, ever.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><span className="font-semibold">Guaranteed Placement Assistance</span> – We ensure every student gets internship and job opportunities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><span className="font-semibold">Expert Guidance</span> – 50+ counselors with years of experience.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><span className="font-semibold">38+ Partner Colleges</span> – Wide network of trusted institutions.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}