import { supabase } from '../../lib/supabase';

let _cache = null;

export async function fetchAllKanji() {
  if (_cache) return _cache;
  const { data, error } = await supabase
    .from('kanji')
    .select('*')
    .order('num');
  if (error) throw error;
  _cache = data;
  return data;
}

export async function fetchKanjiByCategory(category) {
  const { data, error } = await supabase
    .from('kanji')
    .select('*')
    .eq('category', category)
    .order('num');
  if (error) throw error;
  return data;
}

export async function fetchKanjiByLevel(level) {
  const { data, error } = await supabase
    .from('kanji')
    .select('*')
    .eq('jlpt_level', level)
    .order('num');
  if (error) throw error;
  return data;
}

export async function fetchKanjiSections() {
  const { data, error } = await supabase
    .from('kanji')
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

export function clearCache() {
  _cache = null;
}
