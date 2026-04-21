// src/app/pages/ExecutiveEducationPage.tsx

import { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  Briefcase, Users, Award, Clock, Calendar, 
  CheckCircle, ArrowRight, Target, Zap, 
  TrendingUp, Shield, Mail, Phone, MapPin,
  Star, GraduationCap, BookOpen, Coffee
} from 'lucide-react';

export function ExecutiveEducationPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    experience: '',
    program: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', company: '', experience: '', program: '' });
    }, 2000);
  };

  const programs = [
    {
      name: 'Executive MBA',
      duration: '18 Months',
      format: 'Weekend Classes',
      fee: '₹3,50,000',
      highlights: ['Leadership Development', 'Global Immersion', 'Networking Opportunities']
    },
    {
      name: 'PG Diploma in Business Analytics',
      duration: '12 Months',
      format: 'Online + Weekend',
      fee: '₹2,25,000',
      highlights: ['Industry Projects', 'Placement Assistance', 'Certification from IBM']
    },
    {
      name: 'Leadership Development Program',
      duration: '6 Months',
      format: 'Executive Format',
      fee: '₹1,50,000',
      highlights: ['Executive Coaching', 'Peer Learning', 'Strategy Focus']
    },
    {
      name: 'Digital Transformation Certificate',
      duration: '4 Months',
      format: 'Online',
      fee: '₹85,000',
      highlights: ['Case Studies', 'Live Projects', 'Industry Experts']
    }
  ];

  const benefits = [
    { icon: Users, title: 'Peer Network', description: 'Connect with fellow professionals' },
    { icon: Award, title: 'Global Recognition', description: 'UGC approved certificate' },
    { icon: Clock, title: 'Flexible Schedule', description: 'Learn while you work' },
    { icon: TrendingUp, title: 'Career Growth', description: 'Accelerate your career' },
    { icon: Zap, title: 'Industry Experts', description: 'Learn from practitioners' },
    { icon: Shield, title: 'Placement Support', description: 'Dedicated placement cell' }
  ];

  return (
    <>
      <Helmet>
        <title>Executive Education | Programs for Working Professionals - Dreamz College</title>
        <meta name="description" content="Executive education programs designed for working professionals. Upskill, network, and accelerate your career." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">For Working Professionals</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Executive Education
                <span className="block text-purple-600">Upskill. Network. Grow.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Specially designed programs for professionals who want to accelerate their careers without leaving their jobs.
              </p>
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Dreamz Executive Education?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-500 text-sm">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Programs Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{program.format}</p>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">{program.fee}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        Limited Seats
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {program.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-16">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Who Can Apply?</h2>
              <p className="text-gray-600 mt-2">Check if you're eligible for our executive programs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 text-center">
                <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                <p className="text-sm text-gray-500">Bachelor's degree in any discipline</p>
              </div>
              <div className="bg-white rounded-xl p-5 text-center">
                <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Work Experience</h4>
                <p className="text-sm text-gray-500">Minimum 2 years of work experience</p>
              </div>
              <div className="bg-white rounded-xl p-5 text-center">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Entrance</h4>
                <p className="text-sm text-gray-500">Personal Interview + Profile Evaluation</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-16">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-gray-600 text-center italic max-w-2xl mx-auto mb-4">
              "The Executive MBA program at Dreamz College transformed my career. The flexible weekend classes allowed me to continue working while upgrading my skills."
            </p>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Rahul Sharma</p>
              <p className="text-sm text-gray-500">Senior Manager, Amazon | Batch of 2024</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Take the Next Step?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who have accelerated their careers with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.open('https://wa.me/918796033021', '_blank')}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Talk to Counselor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Apply for Executive Program</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-green-600 font-semibold">Application Submitted!</p>
                <p className="text-sm text-gray-500 mt-2">Our counselor will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Current Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Years of Experience *</option>
                  <option value="0-2">0-2 Years</option>
                  <option value="2-5">2-5 Years</option>
                  <option value="5-10">5-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Program *</option>
                  {programs.map((p, idx) => (
                    <option key={idx} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                >
                  Submit Application
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}