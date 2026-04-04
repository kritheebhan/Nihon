import { supabase } from '../../lib/supabase';

let _cache = null;

export async function fetchAllVocabulary() {
  if (_cache) return _cache;
  const { data, error } = await supabase
    .from('vocab')
    .select('*')
    .order('num');
  if (error) throw error;
  _cache = data;
  return data;
}

export async function fetchVocabByCategory(category) {
  const { data, error } = await supabase
    .from('vocab')
    .select('*')
    .eq('category', category)
    .order('num');
  if (error) throw error;
  return data;
}

export async function fetchVocabByLevel(level) {
  const { data, error } = await supabase
    .from('vocab')
    .select('*')
    .eq('jlpt_level', level)
    .order('num');
  if (error) throw error;
  return data;
}

export async function fetchVocabSections() {
  const { data, error } = await supabase
    .from('vocab')
    .select('category, jlpt_level');
  if (error) throw error;
  const sections = {};
  data.forEach(row => {
    if (!sections[row.category]) {
      sections[row.category] = { name: row.category, level: row.jlpt_level, count: 0 };
    }
    sections[row.category].count++;
  });
  return sections;
}

export async function searchVocab(query) {
  const q = query.toLowerCase();
  const { data, error } = await supabase
    .from('vocab')
    .select('*')
    .or(`english.ilike.%${q}%,romaji.ilike.%${q}%,kana.ilike.%${q}%,word.ilike.%${q}%`)
    .order('num')
    .limit(100);
  if (error) throw error;
  return data;
}

export function clearCache() {
  _cache = null;
}
