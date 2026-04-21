// src/admin/components/ContentManagement.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Image, Plus, Edit, Trash2, Search, 
  X, CheckCircle, AlertCircle, RefreshCw, Eye,
  Calendar, User, Tag, Heart, MessageCircle, Share2,
  Upload, Download, Save, Globe, Lock, EyeOff,
  TrendingUp, Star, Award, Clock, Filter
} from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  course: string;
  college: string;
  text: string;
  rating: number;
  image: string;
  verified: boolean;
  featured: boolean;
  createdAt: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  order: number;
  active: boolean;
  createdAt: string;
}

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'blogs' | 'testimonials' | 'banners'>('blogs');
  
  // Blog state
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    published: true
  });
  const [tagInput, setTagInput] = useState('');
  const [blogImage, setBlogImage] = useState<File | null>(null);
  
  // Testimonial state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({
    name: '',
    course: '',
    college: '',
    text: '',
    rating: 5,
    verified: true,
    featured: false
  });
  const [testimonialImage, setTestimonialImage] = useState<File | null>(null);
  
  // Banner state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    link: '',
    order: 0,
    active: true
  });
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBlogs();
    fetchTestimonials();
    fetchBanners();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // ========== BLOG CRUD ==========
  const fetchBlogs = async () => {
    setBlogLoading(true);
    try {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const blogsList: BlogPost[] = [];
      snapshot.forEach((doc) => {
        blogsList.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      setBlogs(blogsList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setBlogLoading(false);
    }
  };

  const handleBlogSubmit = async () => {
    if (!blogForm.title || !blogForm.content) {
      showToast('Please fill required fields', 'error');
      return;
    }

    try {
      let imageUrl = blogForm.image || '';
      if (blogImage) {
        imageUrl = await uploadImage(blogImage, 'blogs');
      }

      const slug = blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const blogData = {
        ...blogForm,
        slug,
        image: imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (editingBlog) {
        const blogRef = doc(db, 'blogs', editingBlog.id);
        await updateDoc(blogRef, blogData);
        showToast('Blog updated successfully', 'success');
      } else {
        await addDoc(collection(db, 'blogs'), {
          ...blogData,
          views: 0,
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString()
        });
        showToast('Blog created successfully', 'success');
      }

      setIsBlogModalOpen(false);
      resetBlogForm();
      fetchBlogs();
    } catch (error) {
      showToast('Failed to save blog', 'error');
    }
  };

  const handleDeleteBlog = async (blog: BlogPost) => {
    if (confirm(`Delete "${blog.title}"?`)) {
      try {
        await deleteDoc(doc(db, 'blogs', blog.id));
        showToast('Blog deleted successfully', 'success');
        fetchBlogs();
      } catch (error) {
        showToast('Failed to delete blog', 'error');
      }
    }
  };

  const resetBlogForm = () => {
    setEditingBlog(null);
    setBlogForm({ title: '', excerpt: '', content: '', category: '', tags: [], published: true });
    setTagInput('');
    setBlogImage(null);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setBlogForm({ ...blogForm, tags: [...(blogForm.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setBlogForm({ ...blogForm, tags: blogForm.tags?.filter((_, i) => i !== index) });
  };

  // ========== TESTIMONIAL CRUD ==========
  const fetchTestimonials = async () => {
    setTestimonialLoading(true);
    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const testimonialsList: Testimonial[] = [];
      snapshot.forEach((doc) => {
        testimonialsList.push({ id: doc.id, ...doc.data() } as Testimonial);
      });
      setTestimonials(testimonialsList);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setTestimonialLoading(false);
    }
  };

  const handleTestimonialSubmit = async () => {
    if (!testimonialForm.name || !testimonialForm.text) {
      showToast('Please fill required fields', 'error');
      return;
    }

    try {
      let imageUrl = testimonialForm.image || '';
      if (testimonialImage) {
        imageUrl = await uploadImage(testimonialImage, 'testimonials');
      }

      const testimonialData = {
        ...testimonialForm,
        image: imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (editingTestimonial) {
        const testimonialRef = doc(db, 'testimonials', editingTestimonial.id);
        await updateDoc(testimonialRef, testimonialData);
        showToast('Testimonial updated successfully', 'success');
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...testimonialData,
          createdAt: new Date().toISOString()
        });
        showToast('Testimonial added successfully', 'success');
      }

      setIsTestimonialModalOpen(false);
      resetTestimonialForm();
      fetchTestimonials();
    } catch (error) {
      showToast('Failed to save testimonial', 'error');
    }
  };

  const handleDeleteTestimonial = async (testimonial: Testimonial) => {
    if (confirm(`Delete testimonial from ${testimonial.name}?`)) {
      try {
        await deleteDoc(doc(db, 'testimonials', testimonial.id));
        showToast('Testimonial deleted successfully', 'success');
        fetchTestimonials();
      } catch (error) {
        showToast('Failed to delete testimonial', 'error');
      }
    }
  };

  const resetTestimonialForm = () => {
    setEditingTestimonial(null);
    setTestimonialForm({ name: '', course: '', college: '', text: '', rating: 5, verified: true, featured: false });
    setTestimonialImage(null);
  };

  // ========== BANNER CRUD ==========
  const fetchBanners = async () => {
    setBannerLoading(true);
    try {
      const bannersRef = collection(db, 'banners');
      const q = query(bannersRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const bannersList: Banner[] = [];
      snapshot.forEach((doc) => {
        bannersList.push({ id: doc.id, ...doc.data() } as Banner);
      });
      setBanners(bannersList);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setBannerLoading(false);
    }
  };

  const handleBannerSubmit = async () => {
    if (!bannerForm.title || !bannerImage) {
      showToast('Please fill required fields and upload image', 'error');
      return;
    }

    try {
      let imageUrl = bannerForm.image || '';
      if (bannerImage) {
        imageUrl = await uploadImage(bannerImage, 'banners');
      }

      const bannerData = {
        ...bannerForm,
        image: imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (editingBanner) {
        const bannerRef = doc(db, 'banners', editingBanner.id);
        await updateDoc(bannerRef, bannerData);
        showToast('Banner updated successfully', 'success');
      } else {
        await addDoc(collection(db, 'banners'), {
          ...bannerData,
          createdAt: new Date().toISOString()
        });
        showToast('Banner added successfully', 'success');
      }

      setIsBannerModalOpen(false);
      resetBannerForm();
      fetchBanners();
    } catch (error) {
      showToast('Failed to save banner', 'error');
    }
  };

  const handleDeleteBanner = async (banner: Banner) => {
    if (confirm(`Delete banner "${banner.title}"?`)) {
      try {
        await deleteDoc(doc(db, 'banners', banner.id));
        showToast('Banner deleted successfully', 'success');
        fetchBanners();
      } catch (error) {
        showToast('Failed to delete banner', 'error');
      }
    }
  };

  const resetBannerForm = () => {
    setEditingBanner(null);
    setBannerForm({ title: '', subtitle: '', link: '', order: 0, active: true });
    setBannerImage(null);
  };

  const toggleBannerActive = async (banner: Banner) => {
    try {
      const bannerRef = doc(db, 'banners', banner.id);
      await updateDoc(bannerRef, { active: !banner.active });
      showToast(`Banner ${!banner.active ? 'activated' : 'deactivated'}`, 'success');
      fetchBanners();
    } catch (error) {
      showToast('Failed to update banner', 'error');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTestimonials = testimonials.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
          <p className="text-sm text-gray-500">Manage blogs, testimonials, and banners</p>
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
            onClick={() => {
              if (activeTab === 'blogs') fetchBlogs();
              else if (activeTab === 'testimonials') fetchTestimonials();
              else fetchBanners();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'blogs', label: 'Blog Posts', icon: FileText },
            { id: 'testimonials', label: 'Testimonials', icon: Star },
            { id: 'banners', label: 'Banners', icon: Image }
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
                <motion.div layoutId="contentTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ========== BLOGS TAB ========== */}
      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetBlogForm();
                setIsBlogModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Blog Post
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogLoading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center"><div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div></td></tr>
                  ) : filteredBlogs.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No blogs found</td></tr>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-gray-900">{blog.title.substring(0, 40)}...</span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{blog.category || 'Uncategorized'}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{blog.views?.toLocaleString() || 0}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-500 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingBlog(blog); setBlogForm(blog); setIsBlogModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteBlog(blog)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            <button onClick={() => window.open(`/blog/${blog.slug}`, '_blank')} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"><Eye className="w-4 h-4" /></button>
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

      {/* ========== TESTIMONIALS TAB ========== */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetTestimonialForm();
                setIsTestimonialModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonialLoading ? (
              <div className="col-span-2 text-center py-12"><div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div></div>
            ) : filteredTestimonials.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-500">No testimonials found</div>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <motion.div key={testimonial.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                      {testimonial.image ? (
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-purple-600">{testimonial.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-xs text-gray-500">{testimonial.course} • {testimonial.college}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{testimonial.text}</p>
                      <div className="flex items-center gap-3 mt-3">
                        {testimonial.verified && <span className="inline-flex items-center gap-1 text-xs text-green-600"><CheckCircle className="w-3 h-3" />Verified</span>}
                        {testimonial.featured && <span className="inline-flex items-center gap-1 text-xs text-orange-600"><Star className="w-3 h-3" />Featured</span>}
                      </div>
                      <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                        <button onClick={() => { setEditingTestimonial(testimonial); setTestimonialForm(testimonial); setIsTestimonialModalOpen(true); }} className="flex-1 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm">Edit</button>
                        <button onClick={() => handleDeleteTestimonial(testimonial)} className="flex-1 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========== BANNERS TAB ========== */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetBannerForm();
                setIsBannerModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </div>

          <div className="space-y-3">
            {bannerLoading ? (
              <div className="text-center py-12"><div className="flex justify-center"><div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" /></div></div>
            ) : filteredBanners.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No banners found</div>
            ) : (
              filteredBanners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-32 bg-gray-100 overflow-hidden">
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{banner.title}</h4>
                          <p className="text-sm text-gray-500">{banner.subtitle}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">Order: {banner.order}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {banner.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toggleBannerActive(banner)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                            {banner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setEditingBanner(banner); setBannerForm(banner); setIsBannerModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteBanner(banner)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========== BLOG MODAL ========== */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={() => setIsBlogModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-900">{editingBlog ? 'Edit Blog' : 'New Blog Post'}</h3><button onClick={() => setIsBlogModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button></div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label><textarea rows={2} value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Content *</label><textarea rows={6} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label><input type="file" accept="image/*" onChange={(e) => setBlogImage(e.target.files?.[0] || null)} className="w-full" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags</label><div className="flex gap-2"><input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg" onKeyPress={(e) => e.key === 'Enter' && addTag()} /><button onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg">Add</button></div><div className="flex flex-wrap gap-2 mt-2">{blogForm.tags?.map((tag, idx) => (<span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{tag}<button onClick={() => removeTag(idx)}><X className="w-3 h-3" /></button></span>))}</div></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={blogForm.published} onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })} className="w-4 h-4" /><label>Publish immediately</label></div>
                <div className="flex gap-3 pt-4"><button onClick={handleBlogSubmit} className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold">{editingBlog ? 'Update' : 'Create'} Blog</button><button onClick={() => setIsBlogModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== TESTIMONIAL MODAL ========== */}
      <AnimatePresence>
        {isTestimonialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsTestimonialModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-900">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3><button onClick={() => setIsTestimonialModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button></div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-gray-700 mb-1">Course</label><input type="text" value={testimonialForm.course} onChange={(e) => setTestimonialForm({ ...testimonialForm, course: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">College</label><input type="text" value={testimonialForm.college} onChange={(e) => setTestimonialForm({ ...testimonialForm, college: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text *</label><textarea rows={4} value={testimonialForm.text} onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label><div className="flex gap-1">{[...Array(5)].map((_, i) => (<button key={i} type="button" onClick={() => setTestimonialForm({ ...testimonialForm, rating: i + 1 })} className="p-1"><Star className={`w-6 h-6 ${i < (testimonialForm.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} /></button>))}</div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Photo</label><input type="file" accept="image/*" onChange={(e) => setTestimonialImage(e.target.files?.[0] || null)} /></div>
                <div className="flex gap-3"><input type="checkbox" checked={testimonialForm.verified} onChange={(e) => setTestimonialForm({ ...testimonialForm, verified: e.target.checked })} /><label>Verified Student</label></div>
                <div className="flex gap-3"><input type="checkbox" checked={testimonialForm.featured} onChange={(e) => setTestimonialForm({ ...testimonialForm, featured: e.target.checked })} /><label>Featured on Homepage</label></div>
                <div className="flex gap-3 pt-4"><button onClick={handleTestimonialSubmit} className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold">{editingTestimonial ? 'Update' : 'Add'} Testimonial</button><button onClick={() => setIsTestimonialModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== BANNER MODAL ========== */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsBannerModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-900">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h3><button onClick={() => setIsBannerModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button></div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label><input type="text" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label><input type="text" value={bannerForm.link} onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-gray-700 mb-1">Order</label><input type="number" value={bannerForm.order} onChange={(e) => setBannerForm({ ...bannerForm, order: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={bannerForm.active ? 'active' : 'inactive'} onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.value === 'active' })} className="w-full px-4 py-2 border border-gray-200 rounded-lg"><option value="active">Active</option><option value="inactive">Inactive</option></select></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Banner Image *</label><input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files?.[0] || null)} /></div>
                <div className="flex gap-3 pt-4"><button onClick={handleBannerSubmit} className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold">{editingBanner ? 'Update' : 'Add'} Banner</button><button onClick={() => setIsBannerModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}