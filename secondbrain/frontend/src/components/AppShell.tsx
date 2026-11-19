import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';
import { ContentType } from '../types';

interface Props {
  active: ContentType | 'all';
  onChange: (f: ContentType | 'all') => void;
  children: React.ReactNode;
}

export default function AppShell({ active, onChange, children }: Props) {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onAsk = pathname === '/ask';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-jersey bg-surface flex">
      {/* Sidebar */}
      <div className="hidden md:flex bg-brain-200 flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 p-2 z-30">
        {/* no filter is highlighted while on the Ask page */}
        <Sidebar
          active={onAsk ? ('none' as unknown as ContentType) : active}
          onChange={onChange}
          username={username || ''}
        />

        <div className="p-3 border-t border-gray-100 mt-auto space-y-1">
          <button
            onClick={() => navigate('/ask')}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              onAsk ? 'bg-brain-50 text-brain-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Ask
          </button>
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
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">{children}</div>
    </div>
  );
}