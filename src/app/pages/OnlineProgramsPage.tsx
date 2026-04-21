// src/app/pages/OnlineProgramsPage.tsx

import { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  Sparkles, Rocket, Clock, Mail, CheckCircle, 
  ArrowRight, Laptop, Users, Award, Globe, 
  Star, Zap, Bell, Send
} from 'lucide-react';

export function OnlineProgramsPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Here you can send to backend/email service
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Online Programs | Coming Soon - Dreamz College</title>
        <meta name="description" content="Online programs coming soon at Dreamz College. Get notified when we launch!" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 pt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Coming Soon</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Online Programs
                <span className="block text-purple-600">Launching Soon!</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're building something amazing for students who want to learn from anywhere, anytime.
              </p>
            </motion.div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Laptop className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Online</h3>
              <p className="text-gray-500 text-sm">Learn from anywhere, anytime. Flexible schedules to fit your life.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Faculty</h3>
              <p className="text-gray-500 text-sm">Learn from industry experts and experienced professors.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">UGC Approved</h3>
              <p className="text-gray-500 text-sm">All programs are UGC-DEB approved and globally recognized.</p>
            </motion.div>
          </div>

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white mb-16"
          >
            <Rocket className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Get Ready for the Future!</h2>
            <p className="text-purple-100 mb-6 max-w-lg mx-auto">
              Our online programs are launching soon. Be the first to know when we open admissions!
            </p>
            
            {/* Notify Form */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitted ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      Notify Me
                    </>
                  )}
                </button>
              </form>
              <p className="text-xs text-purple-200 mt-3">
                We'll notify you when we launch. No spam, unsubscribe anytime.
              </p>
            </div>
          </motion.div>

          {/* FAQ Preview */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Have Questions?</h3>
            <p className="text-gray-600 mb-6">
              Our counselors are here to help you understand our upcoming online programs.
            </p>
            <button
              onClick={() => window.open('https://wa.me/918796033021', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              <Send className="w-4 h-4" />
              Chat with Counselor
            </button>
          </div>
        </div>
      </div>
    </>
  );
}