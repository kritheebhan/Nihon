import { D, allSecs, shuffle } from '../../data';

export function getPool(level, section) {
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

export { shuffle };
