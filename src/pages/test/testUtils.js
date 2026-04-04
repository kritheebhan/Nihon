import { shuffle } from '../../context/DataContext';

export function getPool(D, allSecs, level, section) {
  let pool = [];
  if (section !== 'all') {
    pool = D[section] || [];
  } else {
    allSecs.forEach(s => {
      if (level === 'all' || s.startsWith(level)) {
        pool = pool.concat(D[s] || []);
      }
    });
  }
  return pool.filter(w => w.kana && w.english);
}

// Returns { label, color } for the direction badge in game components
export function getDirectionLabel(category, qtype) {
  if (category === 'kanji') {
    if (qtype === 'en2jp')       return { label: 'Meaning → Kanji 漢字', color: 'bg-purple-50 text-purple-700' };
    if (qtype === 'kanji2read')  return { label: 'Kanji 漢字 → Reading',  color: 'bg-indigo-50 text-indigo-700' };
    return                              { label: 'Kanji 漢字 → Meaning',  color: 'bg-indigo-50 text-indigo-700' };
  }
  if (category === 'hiragana' || category === 'katakana') {
    return qtype !== 'en2jp'
      ? { label: 'Character → Romaji', color: 'bg-n5-light text-n5' }
      : { label: 'Romaji → Character', color: 'bg-n4-light text-n4' };
  }
  return qtype !== 'en2jp'
    ? { label: 'Japanese → English', color: 'bg-n5-light text-n5' }
    : { label: 'English → Japanese', color: 'bg-n4-light text-n4' };
}

export { shuffle };
