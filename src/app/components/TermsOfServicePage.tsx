import { motion } from 'motion/react';
import { BookOpen, CheckCircle, AlertCircle, Scale } from 'lucide-react';

export function TermsOfServicePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
        >
          <Scale className="w-4 h-4" />
          Terms of Service
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Terms & Conditions
        </h1>
        <p className="text-gray-600">
          Effective from: December 2025
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>By accessing and using Dream College services, you agree to be bound by these Terms of Service. If you disagree with any part, you may not use our services.</p>
            <p>These terms apply to all visitors, users, and others who access or use the service.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">2. Services Provided</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li>• Free college counseling and guidance</li>
            <li>• Personalized college recommendations</li>
            <li>• Application assistance</li>
            <li>• Career path guidance</li>
            <li>• Scholarship information</li>
            <li>• Educational content and resources</li>
          </ul>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Dream College provides guidance services only. We do not guarantee college admissions or scholarships.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">3. User Responsibilities</h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p><strong>You agree to:</strong></p>
            <ul className="space-y-2 ml-4">
              <li>• Provide accurate and complete information</li>
              <li>• Use services for lawful purposes only</li>
              <li>• Not misuse or disrupt our services</li>
              <li>• Respect intellectual property rights</li>
              <li>• Be at least 16 years old to use our services</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitation of Liability</h2>
          <div className="space-y-3 text-gray-700">
            <p>Dream College and JuniorDream Pvt Ltd shall not be liable for:</p>
            <ul className="space-y-2 ml-4">
              <li>• Any direct, indirect, or consequential damages</li>
              <li>• College admission decisions</li>
              <li>• Scholarship awards or rejections</li>
              <li>• Changes in college policies or fees</li>
              <li>• Technical issues beyond our control</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">5. Intellectual Property</h3>
            <p className="text-gray-700">
              All content on this website, including text, graphics, logos, and software, is the property of Dream College and protected by copyright laws.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">6. Termination</h3>
            <p className="text-gray-700">
              We may terminate or suspend access to our services immediately, without prior notice, for any breach of these Terms.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms on this page. Continued use after changes constitutes acceptance.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For any questions about these Terms of Service, please contact:
          </p>
          <div className="text-gray-600">
            <p><strong>Dream College by JuniorDream Pvt Ltd</strong></p>
            <p>Email: legal@dreamcollege.in</p>
            <p>Phone: +91 123 456 7890</p>
            <p>Address: 123 Education Plaza, New Delhi - 110001</p>
          </div>
        </div>
      </div>
    </div>
  );
}