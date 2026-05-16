import { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Globe, Lock } from 'lucide-react';
import api from '../lib/api';

interface Props {
  onClose: () => void;
}

export default function ShareModal({ onClose }: Props) {
  const [shared, setShared] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/share/status').then((res) => {
      setShared(res.data.shared);
      setToken(res.data.shareToken);
      setLoading(false);
    });
  }, []);

  const toggleShare = async () => {
    setToggling(true);
    try {
      const res = await api.post('/share/toggle');
      setShared(res.data.shared);
      setToken(res.data.shareToken);
    } finally {
      setToggling(false);
    }
  };

  const shareUrl = token ? `${window.location.origin}/shared/${token}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Share Your Brain</h2>
            <p className="text-sm text-gray-500 mt-0.5">Let others explore your saved content</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-brain-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Status card */}
              <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${shared ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${shared ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                  {shared ? <Globe className="w-6 h-6 text-emerald-600" /> : <Lock className="w-6 h-6 text-gray-500" />}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${shared ? 'text-emerald-800' : 'text-gray-800'}`}>
                    {shared ? 'Brain is Public' : 'Brain is Private'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {shared ? 'Anyone with the link can view' : 'Only you can see your brain'}
                  </p>
                </div>
              </div>

              {/* Share link */}
              {shared && shareUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Share link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 font-mono text-gray-600 truncate"
                    />
                    <button
                      onClick={copyLink}
                      className="flex items-center gap-1.5 px-3 py-2.5 bg-brain-600 text-white rounded-xl text-sm font-medium hover:bg-brain-700 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={toggleShare}
                disabled={toggling}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                  shared
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-brain-600 text-white hover:bg-brain-700'
                }`}
              >
                {toggling ? 'Updating...' : shared ? 'Disable Sharing' : 'Enable Sharing'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
