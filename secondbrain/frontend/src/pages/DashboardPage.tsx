import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Share2, LogOut, Brain, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { ContentItem, ContentType } from '../types';
import Sidebar from '../components/Sidebar';
import ContentCard from '../components/ContentCard';
import AddContentModal from '../components/AddContentModal';
import ShareModal from '../components/ShareModal';

export default function DashboardPage() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<ContentType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [filter]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const res = await api.get('/content', { params });
      setContent(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/content/${id}`);
      setContent((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  const handleAdded = (item: ContentItem) => {
    setContent((prev) => [item, ...prev]);
  };

  const filtered = content.filter((c) =>
    search ? c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) : true
  );

  return (
    <div className="min-h-screen font-jersey bg-surface flex">
      {/* Sidebar */}
      <div className="hidden md:flex bg-brain-200 flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 p-2 z-30">
        <Sidebar active={filter} onChange={setFilter} username={username || ''} />
        <div className="p-3 border-t border-gray-100 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center gap-4">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-brain-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Search */}
          {/* <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your brain..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brain-400 bg-gray-50"
            />
          </div> */}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share Brain</span>
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brain-600 hover:bg-brain-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Content</span>
            </button>
          </div>
        </header>

        {/* Content grid */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {filter === 'all' ? 'All Content' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-brain-50 flex items-center justify-center mb-4">
                <Brain className="w-10 h-10 text-brain-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {search ? 'Nothing found' : 'Your brain is empty'}
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                {search ? `No results for "${search}"` : 'Start saving YouTube videos, tweets, articles and more'}
              </p>
              {!search && (
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brain-600 text-white rounded-xl text-sm font-medium hover:bg-brain-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add your first link
                </button>
              )}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
  {filtered.map((item, i) => (
    <div key={item._id} className="break-inside-avoid mb-4">
      <ContentCard
        item={item}
        onDelete={handleDelete}
        index={i}
      />
    </div>
  ))}
</div>
          )}
        </main>
      </div>

      {showAdd && <AddContentModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </div>
  );
}
