import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain, Lock } from 'lucide-react';
import axios from 'axios';
import { SharedBrain, ContentType } from '../types';
import ContentCard from '../components/ContentCard';

export default function SharedBrainPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<SharedBrain | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/share/${token}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brain-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Lock className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Brain not found</h1>
        <p className="text-gray-500 mb-6">This shared brain doesn't exist or has been made private.</p>
        <Link to="/login" className="px-5 py-2.5 bg-brain-600 text-white rounded-xl text-sm font-medium hover:bg-brain-700 transition-colors">
          Create your own brain
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brain-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">You're viewing</p>
              <h1 className="font-bold text-gray-900">@{data.username}'s Brain</h1>
            </div>
          </div>
          <Link
            to="/signup"
            className="flex items-center gap-2 px-4 py-2 bg-brain-600 text-white rounded-xl text-sm font-medium hover:bg-brain-700 transition-colors"
          >
            <Brain className="w-4 h-4" />
            Create yours
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500">{data.content.length} saved items</p>
        </div>
        {data.content.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400">This brain is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.content.map((item, i) => (
              <ContentCard
                key={item._id}
                item={item}
                onDelete={() => {}}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
