import { useState, useEffect } from 'react';
import { Trash2, ExternalLink, Youtube, Twitter, Tag } from 'lucide-react';
import { ContentItem } from '../types';
import { getYouTubeId, getTwitterTweetId, getDomain } from '../lib/embedHelpers';

interface Props {
  item: ContentItem;
  onDelete: (id: string) => void;
  index?: number;
}

function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

const typeConfig = {
  youtube:   { label: 'YouTube',   color: 'bg-red-50 text-red-600 border-red-200',    icon: Youtube },
  twitter:   { label: 'Twitter',   color: 'bg-sky-50 text-sky-600 border-sky-200',    icon: Twitter },
  reddit:    { label: 'Reddit',    color: 'bg-orange-50 text-orange-600 border-orange-200', icon: RedditIcon },
  instagram: { label: 'Instagram', color: 'bg-pink-50 text-pink-600 border-pink-200', icon: InstagramIcon },
  article:   { label: 'Article',   color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: ExternalLink },
  other:     { label: 'Link',      color: 'bg-gray-50 text-gray-600 border-gray-200', icon: ExternalLink },
};

export default function ContentCard({ item, onDelete, index = 0 }: Props) {
  const [tweetLoaded, setTweetLoaded] = useState(false);
  const ytId = item.type === 'youtube' ? getYouTubeId(item.url) : null;
  const tweetId = item.type === 'twitter' ? getTwitterTweetId(item.url) : null;
  const cfg = typeConfig[item.type] || typeConfig.other;
  const IconComp = cfg.icon;
  const delay = `${index * 60}ms`;

  // Load Twitter widget script once
  useEffect(() => {
    if (item.type !== 'twitter' || !tweetId) return;
    const loadScript = () => {
      if ((window as any).twttr) {
        (window as any).twttr.widgets.load();
        setTweetLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = () => {
        (window as any).twttr?.widgets.load();
        setTweetLoaded(true);
      };
      document.head.appendChild(script);
    };
    loadScript();
  }, [item.type, tweetId]);

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-slide-up opacity-0"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color} shrink-0`}>
            <IconComp className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-brain-600 hover:bg-brain-50 transition-colors"
            title="Open link"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => onDelete(item._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embed area */}
      <div className="px-4 embed-wrapper">
        {item.type === 'youtube' && ytId ? (
          <div className="rounded-xl overflow-hidden aspect-video bg-gray-100">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        ) : item.type === 'twitter' && tweetId ? (
          <div className="min-h-[120px] flex items-center justify-center">
            <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
              <a href={item.url}>Loading tweet…</a>
            </blockquote>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <IconComp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-mono truncate">{getDomain(item.url)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 pt-3 mt-auto">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{item.title}</h3>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-brain-50 text-brain-700 text-xs rounded-full">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
