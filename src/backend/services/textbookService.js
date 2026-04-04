import { supabase } from '../../lib/supabase';

let _genkiCache = null;
let _mnnCache = null;

export async function fetchGenkiLessons() {
  if (_genkiCache) return _genkiCache;
  const { data, error } = await supabase
    .from('textbook_lessons')
    .select('*')
    .eq('book', 'genki')
    .order('lesson_num');
  if (error) throw error;
  _genkiCache = data.map(row => ({
    n: row.lesson_num,
    title: row.title,
    en: row.title_en,
    grammar: row.grammar,
    vocab: row.vocab,
  }));
  return _genkiCache;
}

export async function fetchMnnLessons() {
  if (_mnnCache) return _mnnCache;
  const { data, error } = await supabase
    .from('textbook_lessons')
    .select('*')
    .eq('book', 'mnn')
    .order('lesson_num');
  if (error) throw error;
  _mnnCache = data.map(row => ({
    n: row.lesson_num,
    title: row.title,
    en: row.title_en,
    grammar: row.grammar,
    vocab: row.vocab,
  }));
  return _mnnCache;
}

export function clearCache() {
  _genkiCache = null;
  _mnnCache = null;
}
