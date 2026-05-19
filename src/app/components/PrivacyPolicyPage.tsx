import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
        >
          <Shield className="w-4 h-4" />
          Privacy Policy
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600">
          Last updated: December 2024
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p><strong>Personal Information:</strong> When you register for counseling, we collect your name, email, phone number, and academic details.</p>
            <p><strong>Usage Data:</strong> We collect information about how you interact with our website and services.</p>
            <p><strong>Communication Data:</strong> Any information you provide when contacting our support team.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li>• To provide personalized college counseling services</li>
            <li>• To communicate with you about your counseling sessions</li>
            <li>• To improve our services and website experience</li>
            <li>• To send important updates and educational content</li>
            <li>• To comply with legal obligations</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Protection</h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>We implement industry-standard security measures to protect your personal information:</p>
            <ul className="space-y-2 ml-4">
              <li>• SSL encryption for data transmission</li>
              <li>• Secure servers with restricted access</li>
              <li>• Regular security audits</li>
              <li>• Data anonymization where possible</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Right to Access</h3>
              <p className="text-sm text-gray-600">You can request a copy of your personal data.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Right to Correction</h3>
              <p className="text-sm text-gray-600">You can update or correct your information.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Right to Deletion</h3>
              <p className="text-sm text-gray-600">You can request deletion of your data.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Right to Object</h3>
              <p className="text-sm text-gray-600">You can object to certain data processing.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact for Privacy Concerns</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about our Privacy Policy, please contact our Data Protection Officer:
          </p>
          <div className="text-gray-600">
            <p>Email: info@dreamcollege.in</p>
            <p>Phone: +91 87960 33021 (Mon-Fri, 10AM-6PM)</p>
            <p>Address:  Education Plaza, Greater Noida - 201306</p>
          </div>
        </div>
      </div>
    </div>
  );
}