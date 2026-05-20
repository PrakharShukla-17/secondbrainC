import { Youtube, Twitter, Globe, Instagram, BookOpen, Brain } from 'lucide-react';
import { ContentType } from '../types';

interface Props {
  active: ContentType | 'all';
  onChange: (type: ContentType | 'all') => void;
  username: string;
}

const filters: { key: ContentType | 'all'; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'all',       label: 'All',       icon: Brain,     color: 'text-brain-600' },
  { key: 'youtube',   label: 'YouTube',   icon: Youtube,   color: 'text-red-500' },
  { key: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'text-sky-500' },
  { key: 'reddit',    label: 'Reddit',    icon: Globe,     color: 'text-orange-500' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { key: 'article',   label: 'Articles',  icon: BookOpen,  color: 'text-emerald-500' },
];

export default function Sidebar({ active, onChange, username }: Props) {
  return (
    <aside className="w-64 shrink-0 flex flex-col ">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-6">
        <div className="w-8 h-8 rounded-xl bg-brain-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="font-jersey text-2xl text-gray-900 ">SecondBrain</span>
      </div>

      {/* User badge */}
      <div className="mx-4 mb-4 px-3 py-2 bg-brain-50 rounded-xl border border-brain-100">
        <p className="text-xs text-brain-500 font-medium">Signed in as</p>
        <p className="text-sm font-semibold text-brain-800 truncate">@{username}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="px-2 pt-2 pb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">What? filtered by source, unreal!</p>
        {filters.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === key
                ? 'bg-brain-600 text-white shadow-sm shadow-brain-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className={`w-4 h-4 ${active === key ? 'text-white' : color}`} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
