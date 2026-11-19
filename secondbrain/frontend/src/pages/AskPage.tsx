import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Brain, Send } from 'lucide-react';
import AppShell from '../components/AppShell';
import { askBrain, Source } from '../api/ask';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: Source[];
  error?: boolean;
}

export default function AskPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [linksOnly, setLinksOnly] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const query = input.trim();
    if (!query || loading) return;

    setMessages((m) => [...m, { role: 'user', text: query }]);
    setInput('');
    setLoading(true);

    try {
      const data = await askBrain(query, linksOnly ? 'search' : 'answer');
      const text =
        data.answer ??
        (data.sources.length
          ? 'Here are the most relevant items I found:'
          : "I couldn't find anything relevant in your saved content.");
      setMessages((m) => [...m, { role: 'assistant', text, sources: data.sources }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Something went wrong. Please try again.', error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      active="all"
      onChange={(f) => navigate('/dashboard', { state: { filter: f } })}
    >
      <div className="flex flex-col h-screen">
        <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Ask your Second Brain</h1>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={linksOnly}
              onChange={(e) => setLinksOnly(e.target.checked)}
            />
            Links only
          </label>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-2xl bg-brain-50 flex items-center justify-center mb-4">
                <Brain className="w-10 h-10 text-brain-300" />
              </div>
              <p className="text-gray-500 text-sm max-w-xs">
                Ask anything about what you've saved, e.g. "how do I install Postman?"
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-brain-600 text-white'
                    : m.error
                    ? 'bg-red-50 text-red-700'
                    : 'bg-white border border-gray-100 text-gray-900'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="text-sm [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_a]:text-brain-600 [&_a]:underline">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{m.text}</p>
                )}

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 pt-2">
                    <p className="mb-1 text-xs font-medium uppercase text-gray-400">Sources</p>
                    <ol className="space-y-1 text-sm">
                      {m.sources.map((s, idx) => (
                        <li key={s.url}>
                          <span className="mr-1 text-gray-400">[{idx + 1}]</span>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brain-600 underline"
                          >
                            {s.title}
                          </a>
                          <span className="ml-2 text-xs text-gray-400">{s.type}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="animate-pulse rounded-2xl bg-white border border-gray-100 px-4 py-3 text-sm text-gray-500">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about your saved content..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brain-400 bg-gray-50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 px-5 py-3 bg-brain-600 hover:bg-brain-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}