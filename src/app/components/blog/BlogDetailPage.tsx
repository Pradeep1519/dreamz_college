// src/app/components/blog/BlogDetailPage.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin, GraduationCap, BookOpen } from 'lucide-react';
import { blogPosts, BlogPost } from '../../data/blogData';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';

interface BlogDetailPageProps {
  activePage?: string;
  onPageChange?: (page: string) => void;
  onBookCounseling?: () => void;
}

export function BlogDetailPage({ 
  activePage = 'Blog',
  onPageChange = () => {},
  onBookCounseling = () => {}
}: BlogDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const foundPost = blogPosts.find((p) => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
      const related = blogPosts
        .filter((p) => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
    } else {
      navigate('/blog');
    }
  }, [slug, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation activePage={activePage} onPageChange={onPageChange} onBookCounseling={onBookCounseling} />
        <div className="pt-32 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation 
        activePage={activePage}
        onPageChange={onPageChange}
        onBookCounseling={onBookCounseling}
      />

      {/* Back Button */}
      <div className="pt-24 max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0)}
              </div>
              <span className="font-medium text-gray-700">{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/1200x600/6b21a5/white?text=Blog';
            }}
          />
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            Share:
          </span>
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 bg-gray-100 rounded-full hover:bg-sky-100 hover:text-sky-500 transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </button>
        </div>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-li:text-gray-600 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-gray-200">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">About {post.author}</h3>
              <p className="text-sm text-gray-600">
                Education expert at Dreamz College with years of experience helping students find their perfect career path.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/6b21a5/white?text=Blog';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-1">
                      {relatedPost.title}
                    </h4>
                    <p className="text-xs text-gray-500">{relatedPost.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white mb-16">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Need Help with Admission?</h3>
          <p className="text-white/90 mb-4 max-w-md mx-auto">
            Book a free counseling session with our expert counselors and get personalized guidance!
          </p>
          <button
            onClick={onBookCounseling}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Book Free Counseling →
          </button>
        </div>
      </div>

      <Footer onNavigate={onPageChange} />
    </div>
  );
}