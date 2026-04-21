import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserInquiries } from '../../lib/firebase';
import { motion } from 'motion/react';
import { BookOpen, Calendar, CheckCircle, Clock, GraduationCap, User, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UserDashboard() {
  const { user, userData } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.phone) {
      getUserInquiries(userData.phone).then(setInquiries).finally(() => setLoading(false));
    }
  }, [userData]);

  if (loading) return <div className="pt-20 text-center">Loading...</div>;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <User className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{userData?.name || 'Student'}</h2>
              <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> {userData?.phone}</p>
              <p className="text-gray-500 text-sm flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> {userData?.email}</p>
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Applications</span>
                <span className="font-bold text-purple-600">{inquiries.length}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>
            {inquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No applications yet. Explore courses and apply!</p>
                <Link to="/" className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg">Browse Courses</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <motion.div key={inquiry.id} whileHover={{ y: -2 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{inquiry.course}</h3>
                          {inquiry.specialization && <p className="text-sm text-gray-500">Specialization: {inquiry.specialization}</p>}
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Submitted</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}