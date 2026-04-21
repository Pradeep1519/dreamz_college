// src/admin/components/AnalyticsReports.tsx

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, Users, Eye, Calendar, 
  Download, Filter, RefreshCw, ArrowUp, ArrowDown,
  PieChart, LineChart, Activity, Clock, MapPin,
  Smartphone, Monitor, Chrome, Globe, FileText,
  Mail, Phone, MessageCircle, Share2, ThumbsUp
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

interface AnalyticsData {
  totalUsers: number;
  totalViews: number;
  totalApplications: number;
  conversionRate: number;
  monthlyData: { month: string; users: number; views: number }[];
  deviceStats: { device: string; count: number }[];
  locationStats: { location: string; count: number }[];
  topColleges: { name: string; views: number }[];
  topCourses: { name: string; enrollments: number }[];
}

export function AnalyticsReports() {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalViews: 0,
    totalApplications: 0,
    conversionRate: 0,
    monthlyData: [],
    deviceStats: [],
    locationStats: [],
    topColleges: [],
    topCourses: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [reportType, setReportType] = useState<'users' | 'colleges' | 'applications'>('users');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const totalUsers = usersSnapshot.size;

      // Generate monthly data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const monthlyData = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        monthlyData.push({
          month: months[monthIndex],
          users: Math.floor(Math.random() * 100) + 50,
          views: Math.floor(Math.random() * 500) + 200
        });
      }

      // Device stats (mock data)
      const deviceStats = [
        { device: 'Mobile', count: 65 },
        { device: 'Desktop', count: 28 },
        { device: 'Tablet', count: 7 }
      ];

      // Location stats
      const locationStats = [
        { location: 'Greater Noida', count: 45 },
        { location: 'Noida', count: 30 },
        { location: 'Delhi', count: 25 },
        { location: 'Ghaziabad', count: 20 },
        { location: 'Other', count: 15 }
      ];

      // Top colleges
      const topColleges = [
        { name: 'GN Group of Institutions', views: 12500 },
        { name: 'Mangalmay Group', views: 10800 },
        { name: 'Sharda University', views: 9500 },
        { name: 'Galgotias University', views: 8200 },
        { name: 'NIET', views: 7600 }
      ];

      // Top courses
      const topCourses = [
        { name: 'B.Tech CSE', enrollments: 450 },
        { name: 'MBA', enrollments: 380 },
        { name: 'BCA', enrollments: 320 },
        { name: 'BBA', enrollments: 290 },
        { name: 'B.Pharm', enrollments: 210 }
      ];

      setData({
        totalUsers,
        totalViews: 45230,
        totalApplications: 1250,
        conversionRate: 2.76,
        monthlyData,
        deviceStats,
        locationStats,
        topColleges,
        topCourses
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      ...data
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxUsers = Math.max(...data.monthlyData.map(d => d.users), 1);
  const maxViews = Math.max(...data.monthlyData.map(d => d.views), 1);

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(change)}% from last {dateRange}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
          <p className="text-sm text-gray-500">Track platform performance and user behavior</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={data.totalUsers} icon={Users} color="bg-purple-600" change={12.5} />
        <StatCard title="Page Views" value={data.totalViews} icon={Eye} color="bg-blue-600" change={8.3} />
        <StatCard title="Applications" value={data.totalApplications} icon={FileText} color="bg-green-600" change={-2.1} />
        <StatCard title="Conversion Rate" value={`${data.conversionRate}%`} icon={TrendingUp} color="bg-orange-600" change={1.2} />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-xs text-gray-500">New Users</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <div className="flex h-full items-end gap-3">
              {data.monthlyData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.users / maxUsers) * 200}px` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-lg hover:opacity-80 transition-all cursor-pointer"
                    style={{ height: `${(item.users / maxUsers) * 200}px` }}
                  />
                  <span className="text-xs text-gray-500">{item.month}</span>
                  <span className="text-xs font-medium text-gray-700">{item.users}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Views Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Page Views</h3>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-xs text-gray-500">Views</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <div className="flex h-full items-end gap-3">
              {data.monthlyData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.views / maxViews) * 200}px` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-lg hover:opacity-80 transition-all cursor-pointer"
                    style={{ height: `${(item.views / maxViews) * 200}px` }}
                  />
                  <span className="text-xs text-gray-500">{item.month}</span>
                  <span className="text-xs font-medium text-gray-700">{item.views}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device & Location Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
          <div className="space-y-4">
            {data.deviceStats.map((device, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    {device.device === 'Mobile' ? <Smartphone className="w-4 h-4" /> :
                     device.device === 'Desktop' ? <Monitor className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                    <span>{device.device}</span>
                  </div>
                  <span className="font-medium">{device.count}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${device.count}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-purple-600 rounded-full h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
          <div className="space-y-4">
            {data.locationStats.map((location, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location.location}</span>
                  </div>
                  <span className="font-medium">{location.count}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${location.count}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-blue-600 rounded-full h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Colleges & Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Colleges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Viewed Colleges</h3>
          <div className="space-y-3">
            {data.topColleges.map((college, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900">{college.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-purple-600">{college.views.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Enrolled Courses</h3>
          <div className="space-y-3">
            {data.topCourses.map((course, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900">{course.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-green-600">{course.enrollments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Reports</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center gap-2 justify-center px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-sm">PDF Report</span>
          </button>
          <button className="flex items-center gap-2 justify-center px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Excel Sheet</span>
          </button>
          <button className="flex items-center gap-2 justify-center px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm">CSV Export</span>
          </button>
          <button className="flex items-center gap-2 justify-center px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <FileText className="w-4 h-4 text-orange-600" />
            <span className="text-sm">JSON Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}