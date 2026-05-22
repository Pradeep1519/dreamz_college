// src/admin/components/JobManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase, Plus, Edit, Trash2, Search, RefreshCw,
  CheckCircle, AlertCircle, X, Save, Eye,
  MapPin, Building2, Home, Users, Clock, Award,
  EyeOff, MailOpen, PhoneCall, Shield, MoreVertical, GraduationCap,
  FileText, Upload, SwitchCamera, Sparkles, Zap
} from 'lucide-react';
import { Job, getAllJobs, createJob, updateJob, deleteJob, closeJob } from '../../lib/firebase';

const workTypeOptions = [
  { value: 'On-site', label: 'On-site', icon: Building2 },
  { value: 'Remote', label: 'Remote', icon: Home },
  { value: 'Hybrid', label: 'Hybrid', icon: Building2 }
];

const jobTypeOptions = [
  'Full Time', 'Part Time', 'Internship', 'Contract', 'Freelance', 'Temporary'
];

// 🔥 UPDATED: More Category Options
const categoryOptions = [
  'Counseling', 'Creative', 'Sales', 'Other',
  'Engineering', 'Medical', 'Nursing', 'Pharmacy',
  'Management', 'IT & Computer', 'Law', 'Commerce',
  'Education', 'Marketing', 'HR', 'Finance',
  'Operations', 'Customer Support', 'Design', 'Content Writing',
  'Video Editing', 'Social Media', 'Digital Marketing', 'Business Development',
  'Data Science', 'AI/ML', 'Cloud Computing', 'Cyber Security',
  'Blockchain', 'DevOps'
];

// 🔥 UPDATED: More Experience Options
const experienceOptions = [
  'Freshers can apply',
  '0-1 years', '1-2 years', '2-3 years', '3-5 years',
  '5-7 years', '7-10 years', '10+ years'
];

// 🔥 NEW: Requirement Suggestions
const requirementSuggestions = [
  'Excellent communication skills in Hindi & English',
  'Confident & result-oriented personality',
  'Passion for helping students',
  'Basic computer knowledge',
  'Self-motivated and able to work independently',
  'Good leadership skills',
  'Team player',
  'Problem-solving attitude',
  'Time management skills',
  'Attention to detail',
  'Customer service experience',
  'Sales experience',
  'Marketing knowledge',
  'Social media management',
  'Video editing skills (Premiere Pro, CapCut)',
  'Content creation skills',
  'Degree in relevant field',
  'MBA preferred',
  'B.Tech/B.E. degree',
  'Knowledge of college admission process'
];

export function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [requirementInput, setRequirementInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: 'Dreamz College (by JuniorDream Pvt Ltd)',
    location: '',
    workType: 'On-site' as 'On-site' | 'Remote' | 'Hybrid',
    type: 'Full Time' as 'Full Time' | 'Part Time' | 'Internship' | 'Contract' | 'Freelance' | 'Temporary',
    category: 'Counseling' as string,
    experience: '',
    description: '',
    requirements: [] as string[],
    openings: 1,
    requireResume: false
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      showToast('Failed to fetch jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()]
      });
      setRequirementInput('');
      setShowSuggestions(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    if (!formData.requirements.includes(suggestion)) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, suggestion]
      });
    }
    setShowSuggestions(false);
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !formData.description) {
      showToast('Please fill required fields', 'error');
      return;
    }

    try {
      if (editingJob) {
        await updateJob(editingJob.id!, {
          title: formData.title,
          location: formData.location,
          workType: formData.workType,
          type: formData.type,
          category: formData.category,
          experience: formData.experience,
          description: formData.description,
          requirements: formData.requirements,
          openings: formData.openings,
          requireResume: formData.requireResume
        });
        showToast('Job updated successfully', 'success');
      } else {
        await createJob(formData);
        showToast('Job created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      showToast('Failed to save job', 'error');
    }
  };

  const handleCloseJob = async (job: Job) => {
    if (confirm(`Close "${job.title}"? It will be hidden from career page.`)) {
      try {
        await closeJob(job.id!);
        showToast('Job closed', 'success');
        fetchJobs();
      } catch (error) {
        showToast('Failed to close job', 'error');
      }
    }
  };

  const handleDeleteJob = async (job: Job) => {
    if (confirm(`Delete "${job.title}"? This action cannot be undone.`)) {
      try {
        await deleteJob(job.id!);
        showToast('Job deleted', 'success');
        fetchJobs();
      } catch (error) {
        showToast('Failed to delete job', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      company: 'Dreamz College (by JuniorDream Pvt Ltd)',
      location: '',
      workType: 'On-site',
      type: 'Full Time',
      category: 'Counseling',
      experience: '',
      description: '',
      requirements: [],
      openings: 1,
      requireResume: false
    });
    setRequirementInput('');
    setShowSuggestions(false);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      workType: job.workType,
      type: job.type,
      category: job.category,
      experience: job.experience,
      description: job.description,
      requirements: job.requirements || [],
      openings: job.openings,
      requireResume: job.requireResume || false
    });
    setIsModalOpen(true);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-700';
    if (status === 'closed') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white text-sm ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">💼 Job Management</h2>
          <p className="text-sm text-gray-500">Create and manage job openings</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Jobs</p>
          <p className="text-2xl font-bold">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Closed</p>
          <p className="text-2xl font-bold text-yellow-600">{jobs.filter(j => j.status === 'closed').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Openings</p>
          <p className="text-2xl font-bold text-blue-600">{jobs.reduce((sum, j) => sum + (j.openings || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Resume Required</p>
          <p className="text-2xl font-bold text-purple-600">{jobs.filter(j => j.requireResume).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title, location or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Job Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Openings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Resume</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Posted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">{job.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{job.type}</span>
                    </td>
                    <td className="px-4 py-3">{job.openings}</td>
                    <td className="px-4 py-3">
                      {job.requireResume ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1 w-fit">
                          <FileText className="w-3 h-3" /> Required
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">Optional</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(job)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        {job.status === 'active' && (
                          <button onClick={() => handleCloseJob(job)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg"><EyeOff className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => handleDeleteJob(job)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingJob ? 'Edit Job' : 'Post New Job'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Job Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Location *</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Noida, Delhi NCR" className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Work Type</label><select value={formData.workType} onChange={(e) => setFormData({ ...formData, workType: e.target.value as any })} className="w-full px-4 py-2 border rounded-lg">{workTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-1">Job Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-4 py-2 border rounded-lg">{jobTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Experience</label><select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full px-4 py-2 border rounded-lg">{experienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-1">Number of Openings</label><input type="number" value={formData.openings} onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" /></div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="requireResume"
                    checked={formData.requireResume}
                    onChange={(e) => setFormData({ ...formData, requireResume: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <label htmlFor="requireResume" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Require Resume/CV from applicants
                  </label>
                </div>

                <div><label className="block text-sm font-medium mb-1">Job Description *</label><textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Describe the role, responsibilities, and benefits..." /></div>

                <div><label className="block text-sm font-medium mb-1">Requirements</label>
                  <div className="flex gap-2 mb-2 relative">
                    <input
                      type="text"
                      value={requirementInput}
                      onChange={(e) => {
                        setRequirementInput(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Add a requirement or choose from suggestions"
                      className="flex-1 px-4 py-2 border rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                    />
                    <button onClick={addRequirement} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Add</button>
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 mt-1 w-full max-w-md bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                      >
                        {requirementSuggestions
                          .filter(s => s.toLowerCase().includes(requirementInput.toLowerCase()))
                          .map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => addSuggestion(suggestion)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
                            >
                              <Sparkles className="w-3 h-3 text-purple-500" />
                              {suggestion}
                            </button>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requirements.map((req, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {req}
                        <button onClick={() => removeRequirement(idx)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={handleSubmit} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-semibold"><Save className="w-4 h-4 inline mr-2" />{editingJob ? 'Update Job' : 'Post Job'}</button>
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-lg font-semibold">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}