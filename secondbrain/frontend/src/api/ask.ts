import api from '../lib/api';

export interface Source {
  title: string;
  url: string;
  type: string;
}

export interface AskResponse {
  answer: string | null;
  sources: Source[];
}

export async function askBrain(
  query: string,
  mode: 'answer' | 'search' = 'answer'
): Promise<AskResponse> {
  const res = await api.post('/v1/ask', { query, mode });
  return res.data;
}