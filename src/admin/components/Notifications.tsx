// src/admin/components/Notifications.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Send, Mail, MessageCircle, Users, 
  Plus, Trash2, Edit, Eye, RefreshCw, CheckCircle,
  AlertCircle, X, Calendar, Clock, Filter, Search,
  Download, Upload, SendHorizonal, FileText,
  Phone, Globe, Target, Sparkles, Award, TrendingUp,
  UserPlus, Heart, Star, Zap, Shield, Database
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where } from 'firebase/firestore';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promo';
  audience: 'all' | 'students' | 'admins' | 'specific';
  targetUsers?: string[];
  sendEmail: boolean;
  sendSMS: boolean;
  sendPush: boolean;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentCount: number;
  openedCount: number;
  createdAt: string;
  sentAt?: string;
}

interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  template: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

interface SMSCampaign {
  id: string;
  message: string;
  recipients: number;
  sent: number;
  delivered: number;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export function Notifications() {
  const [activeTab, setActiveTab] = useState<'push' | 'email' | 'sms'>('push');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [smsCampaigns, setSmsCampaigns] = useState<SMSCampaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Push Notification Form
  const [notificationForm, setNotificationForm] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'info',
    audience: 'all',
    sendEmail: false,
    sendSMS: false,
    sendPush: true,
    status: 'draft'
  });
  
  // Email Campaign Form
  const [emailForm, setEmailForm] = useState<Partial<EmailCampaign>>({
    subject: '',
    content: '',
    template: 'default',
    status: 'draft'
  });
  
  // SMS Campaign Form
  const [smsForm, setSmsForm] = useState<Partial<SMSCampaign>>({
    message: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch push notifications
      const notifRef = collection(db, 'notifications');
      const notifSnapshot = await getDocs(query(notifRef, orderBy('createdAt', 'desc')));
      const notifList: Notification[] = [];
      notifSnapshot.forEach((doc) => {
        notifList.push({ id: doc.id, ...doc.data() } as Notification);
      });
      setNotifications(notifList);
      
      // Fetch email campaigns
      const emailRef = collection(db, 'email_campaigns');
      const emailSnapshot = await getDocs(query(emailRef, orderBy('createdAt', 'desc')));
      const emailList: EmailCampaign[] = [];
      emailSnapshot.forEach((doc) => {
        emailList.push({ id: doc.id, ...doc.data() } as EmailCampaign);
      });
      setEmailCampaigns(emailList);
      
      // Fetch SMS campaigns
      const smsRef = collection(db, 'sms_campaigns');
      const smsSnapshot = await getDocs(query(smsRef, orderBy('createdAt', 'desc')));
      const smsList: SMSCampaign[] = [];
      smsSnapshot.forEach((doc) => {
        smsList.push({ id: doc.id, ...doc.data() } as SMSCampaign);
      });
      setSmsCampaigns(smsList);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPush = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      showToast('Please fill title and message', 'error');
      return;
    }

    try {
      const notifData = {
        ...notificationForm,
        status: 'sent',
        sentCount: 1250,
        openedCount: 0,
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      if (editingItem) {
        await updateDoc(doc(db, 'notifications', editingItem.id), notifData);
        showToast('Notification updated', 'success');
      } else {
        await addDoc(collection(db, 'notifications'), notifData);
        showToast('Notification sent successfully!', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      showToast('Failed to send notification', 'error');
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.content) {
      showToast('Please fill subject and content', 'error');
      return;
    }

    try {
      const emailData = {
        ...emailForm,
        recipients: 2540,
        sent: 0,
        opened: 0,
        clicked: 0,
        status: 'sending',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      if (editingItem) {
        await updateDoc(doc(db, 'email_campaigns', editingItem.id), emailData);
        showToast('Email campaign updated', 'success');
      } else {
        await addDoc(collection(db, 'email_campaigns'), emailData);
        showToast('Email campaign created! Sending...', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      showToast('Failed to create email campaign', 'error');
    }
  };

  const handleSendSMS = async () => {
    if (!smsForm.message) {
      showToast('Please enter message', 'error');
      return;
    }

    try {
      const smsData = {
        ...smsForm,
        recipients: 2540,
        sent: 0,
        delivered: 0,
        status: 'sending',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      if (editingItem) {
        await updateDoc(doc(db, 'sms_campaigns', editingItem.id), smsData);
        showToast('SMS campaign updated', 'success');
      } else {
        await addDoc(collection(db, 'sms_campaigns'), smsData);
        showToast('SMS campaign created! Sending...', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      showToast('Failed to create SMS campaign', 'error');
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (confirm('Are you sure you want to delete this?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        showToast('Deleted successfully', 'success');
        fetchData();
      } catch (error) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setNotificationForm({ title: '', message: '', type: 'info', audience: 'all', sendEmail: false, sendSMS: false, sendPush: true, status: 'draft' });
    setEmailForm({ subject: '', content: '', template: 'default', status: 'draft' });
    setSmsForm({ message: '', status: 'draft' });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      promo: 'bg-purple-100 text-purple-700'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-600',
      scheduled: 'bg-yellow-100 text-yellow-700',
      sending: 'bg-blue-100 text-blue-700',
      sent: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmails = emailCampaigns.filter(e =>
    e.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSMS = smsCampaigns.filter(s =>
    s.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500">Send push notifications, email campaigns & SMS alerts</p>
        </div>
        <div className="flex gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Push Notifications" value={notifications.length} icon={Bell} color="bg-purple-600" />
        <StatCard title="Email Campaigns" value={emailCampaigns.length} icon={Mail} color="bg-blue-600" />
        <StatCard title="SMS Campaigns" value={smsCampaigns.length} icon={MessageCircle} color="bg-green-600" />
        <StatCard title="Total Recipients" value="12,450" icon={Users} color="bg-orange-600" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'push', label: 'Push Notifications', icon: Bell },
            { id: 'email', label: 'Email Campaigns', icon: Mail },
            { id: 'sms', label: 'SMS Campaigns', icon: MessageCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="notifTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ========== PUSH NOTIFICATIONS ========== */}
      {activeTab === 'push' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              <Bell className="w-4 h-4" />
              Send Notification
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Audience</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center"><div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div></td></tr>
                  ) : filteredNotifications.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No notifications sent yet</td></tr>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <tr key={notif.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{notif.message}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notif.type)}`}>
                            {notif.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{notif.audience}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notif.status)}`}>
                            {notif.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{notif.sentCount?.toLocaleString() || 0}</td>
                        <td className="px-6 py-3 text-gray-500 text-sm">{new Date(notif.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingItem(notif); setNotificationForm(notif); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('notifications', notif.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========== EMAIL CAMPAIGNS ========== */}
      {activeTab === 'email' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              <Mail className="w-4 h-4" />
              Create Email Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="text-center py-12"><div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div></div>
            ) : filteredEmails.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No email campaigns yet</div>
            ) : (
              filteredEmails.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{campaign.subject}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{campaign.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className="text-xs text-gray-500">Recipients: {campaign.recipients}</span>
                        <span className="text-xs text-green-600">Opened: {campaign.opened}%</span>
                        <span className="text-xs text-blue-600">Clicked: {campaign.clicked}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('email_campaigns', campaign.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========== SMS CAMPAIGNS ========== */}
      {activeTab === 'sms' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              <MessageCircle className="w-4 h-4" />
              Send SMS Campaign
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Recipients</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Delivered</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div></td></tr>
                  ) : filteredSMS.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No SMS campaigns yet</td></tr>
                  ) : (
                    filteredSMS.map((sms) => (
                      <tr key={sms.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <p className="text-sm text-gray-900 line-clamp-1">{sms.message}</p>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sms.status)}`}>
                            {sms.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{sms.recipients?.toLocaleString() || 0}</td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{sms.delivered?.toLocaleString() || 0}</td>
                        <td className="px-6 py-3 text-gray-500 text-sm">{new Date(sms.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('sms_campaigns', sms.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL ========== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {activeTab === 'push' && (editingItem ? 'Edit Notification' : 'Send Push Notification')}
                  {activeTab === 'email' && (editingItem ? 'Edit Email Campaign' : 'Create Email Campaign')}
                  {activeTab === 'sms' && (editingItem ? 'Edit SMS Campaign' : 'Send SMS Campaign')}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeTab === 'push' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                      placeholder="Notification title"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      rows={3}
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                      placeholder="Notification message"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={notificationForm.type}
                        onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                        <option value="promo">Promo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                      <select
                        value={notificationForm.audience}
                        onChange={(e) => setNotificationForm({ ...notificationForm, audience: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      >
                        <option value="all">All Users</option>
                        <option value="students">Students Only</option>
                        <option value="admins">Admins Only</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={notificationForm.sendEmail} onChange={(e) => setNotificationForm({ ...notificationForm, sendEmail: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm text-gray-700">Also send as Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={notificationForm.sendSMS} onChange={(e) => setNotificationForm({ ...notificationForm, sendSMS: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm text-gray-700">Also send as SMS</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      placeholder="Email subject"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                    <textarea
                      rows={6}
                      value={emailForm.content}
                      onChange={(e) => setEmailForm({ ...emailForm, content: e.target.value })}
                      placeholder="Email content (HTML supported)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                    <select
                      value={emailForm.template}
                      onChange={(e) => setEmailForm({ ...emailForm, template: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="default">Default Template</option>
                      <option value="promo">Promotional</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'sms' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      rows={4}
                      value={smsForm.message}
                      onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                      placeholder="SMS message (max 160 characters)"
                      maxLength={160}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{smsForm.message?.length || 0}/160 characters</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={activeTab === 'push' ? handleSendPush : activeTab === 'email' ? handleSendEmail : handleSendSMS}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {editingItem ? 'Update' : activeTab === 'push' ? 'Send Notification' : activeTab === 'email' ? 'Create Campaign' : 'Send SMS'}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}