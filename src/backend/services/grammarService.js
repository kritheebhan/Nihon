import { supabase } from '../../lib/supabase';

let _cache = null;

export async function fetchAllGrammar() {
  if (_cache) return _cache;
  const { data, error } = await supabase
    .from('grammar')
    .select('*')
    .order('id');
  if (error) throw error;

  // Transform DB format to match original GRAMMAR array format
  _cache = data.map(g => ({
    id: g.id,
    level: g.level,
    title: g.title,
    meaning: g.meaning,
    structure: g.structure,
    examples: parseExamples(g.example_jp, g.example_en),
    tags: g.tags ? g.tags.split(',').map(t => t.trim()) : [],
    src: g.source ? [g.source] : [],
  }));
  return _cache;
}

function parseExamples(jp, en) {
  if (!jp) return [];
  const jpParts = jp.split(' | ');
  const enParts = en ? en.split(' | ') : [];
  return jpParts.map((j, i) => ({
    jp: j.trim(),
    en: (enParts[i] || '').trim(),
  }));
}

export async function fetchGrammarByLevel(level) {
  const all = await fetchAllGrammar();
  return all.filter(g => g.level === level);
}

export function clearCache() {
  _cache = null;
}
