import { supabase } from '../../lib/supabase';

let _hiraCache = null;
let _kataCache = null;

async function fetchKanaByType(scriptType) {
  const { data, error } = await supabase
    .from('kana')
    .select('*')
    .eq('script_type', scriptType)
    .order('created_at');
  if (error) throw error;

  // Group by group_type and row_name to match the original { basic, dakuten, combo } structure
  const result = { basic: [], dakuten: [], combo: [] };
  const rowMap = {};

  data.forEach(char => {
    const key = `${char.group_type}|${char.row_name}`;
    if (!rowMap[key]) {
      rowMap[key] = { r: char.row_name, chars: [] };
      result[char.group_type].push(rowMap[key]);
    }
    const charObj = { c: char.character, r: char.romaji };
    if (char.english_note) charObj.e = char.english_note;
    if (char.hiragana_equivalent) charObj.h = char.hiragana_equivalent;
    rowMap[key].chars.push(charObj);
  });

  return result;
}

export async function fetchHiragana() {
  if (_hiraCache) return _hiraCache;
  _hiraCache = await fetchKanaByType('hiragana');
  return _hiraCache;
}

export async function fetchKatakana() {
  if (_kataCache) return _kataCache;
  _kataCache = await fetchKanaByType('katakana');
  return _kataCache;
}

export function clearCache() {
  _hiraCache = null;
  _kataCache = null;
}
