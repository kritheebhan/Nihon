import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GRAMMAR as LOCAL_GRAMMAR } from '../data/grammarData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultData = {
    D: {}, META: {}, allSecs: [], n5Secs: [], n4Secs: [], n3Secs: [],
    n5KanjiSecs: [], n4KanjiSecs: [], n3KanjiSecs: [],
    n5VocabSecs: [], n4VocabSecs: [],
    totalWords: 0, n5Total: 0, n4Total: 0, n3Total: 0, kanjiTotal: 0,
    HIRA: { basic: [], dakuten: [], combo: [] }, KATA: { basic: [], dakuten: [], combo: [] },
    GRAMMAR: [], GENKI: [], MNN: [],
  };

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [vocabRes, kanjiRes, kanaRes, textbookRes] = await Promise.all([
        supabase.from('vocab').select('*').order('num'),
        supabase.from('kanji').select('*').order('num'),
        supabase.from('kana').select('*').order('created_at'),
        supabase.from('textbook_lessons').select('*').order('lesson_num'),
      ]);

      // Build D object: { "N5 Greetings": [{num, kanji, kana, romaji, english}, ...], ... }
      const D = {};
      (vocabRes.data || []).forEach(row => {
        if (!D[row.category]) D[row.category] = [];
        D[row.category].push({
          num: row.num,
          kanji: row.word,
          kana: row.kana,
          romaji: row.romaji,
          english: row.english,
        });
      });

      // Add kanji sections to D
      (kanjiRes.data || []).forEach(row => {
        if (!D[row.category]) D[row.category] = [];
        D[row.category].push({
          num: row.num,
          kanji: row.kanji,
          kana: row.kana,
          romaji: row.romaji || '',
          english: row.english,
          example: row.example,
          exReading: row.ex_reading,
          exEnglish: row.ex_english,
          onReading: row.on_reading || '',
          kunReading: row.kun_reading || '',
          strokeCount: row.stroke_count || null,
        });
      });

      // Build section metadata
      const META = {};
      Object.keys(D).forEach(key => { META[key] = D[key].length; });

      const allSecs = Object.keys(D);
      const n5Secs = allSecs.filter(s => s.startsWith('N5'));
      const n4Secs = allSecs.filter(s => s.startsWith('N4'));
      const n3Secs = allSecs.filter(s => s.startsWith('N3'));
      const n5KanjiSecs = allSecs.filter(s => s.startsWith('N5 Kanji'));
      const n4KanjiSecs = allSecs.filter(s => s.startsWith('N4 Kanji'));
      const n3KanjiSecs = allSecs.filter(s => s.startsWith('N3 Kanji'));
      const n5VocabSecs = n5Secs.filter(s => !s.includes('Kanji'));
      const n4VocabSecs = n4Secs.filter(s => !s.includes('Kanji'));

      const totalWords = Object.values(D).reduce((sum, arr) => sum + arr.length, 0);
      const n5Total = n5Secs.reduce((sum, s) => sum + D[s].length, 0);
      const n4Total = n4Secs.reduce((sum, s) => sum + D[s].length, 0);
      const n3Total = n3Secs.reduce((sum, s) => sum + D[s].length, 0);
      const kanjiTotal = [...n5KanjiSecs, ...n4KanjiSecs, ...n3KanjiSecs].reduce((sum, s) => sum + D[s].length, 0);

      // Build kana objects
      const HIRA = { basic: [], dakuten: [], combo: [] };
      const KATA = { basic: [], dakuten: [], combo: [] };
      const hiraMap = {};
      const kataMap = {};

      (kanaRes.data || []).forEach(char => {
        const isHira = char.script_type === 'hiragana';
        const target = isHira ? HIRA : KATA;
        const map = isHira ? hiraMap : kataMap;
        const key = `${char.group_type}|${char.row_name}`;
        if (!map[key]) {
          map[key] = { r: char.row_name, chars: [] };
          target[char.group_type].push(map[key]);
        }
        const charObj = { c: char.character, r: char.romaji };
        if (char.english_note) charObj.e = char.english_note;
        if (char.hiragana_equivalent) charObj.h = char.hiragana_equivalent;
        map[key].chars.push(charObj);
      });

      // Use local grammar data (richer dataset with Tamil translations)
      const GRAMMAR = LOCAL_GRAMMAR;

      // Build textbook data
      const genkiLessons = [];
      const mnnLessons = [];
      (textbookRes.data || []).forEach(row => {
        const lesson = { n: row.lesson_num, title: row.title, en: row.title_en, grammar: row.grammar, vocab: row.vocab };
        if (row.book === 'genki') genkiLessons.push(lesson);
        else mnnLessons.push(lesson);
      });

      setData({
        D, META, allSecs,
        n5Secs, n4Secs, n3Secs,
        n5KanjiSecs, n4KanjiSecs, n3KanjiSecs,
        n5VocabSecs, n4VocabSecs,
        totalWords, n5Total, n4Total, n3Total, kanjiTotal,
        HIRA, KATA, GRAMMAR,
        GENKI: genkiLessons, MNN: mnnLessons,
      });
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading study data...</p>
        </div>
      </div>
    );
  }

  return (
      <DataContext.Provider value={data || defaultData}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

// Utility functions (same as before)
export function displayName(sectionName) {
  return sectionName.replace(/^N[345]\s+/, '');
}

export function getLevel(sectionName) {
  if (sectionName.startsWith('N5')) return 'N5';
  if (sectionName.startsWith('N4')) return 'N4';
  if (sectionName.startsWith('N3')) return 'N3';
  return 'N5';
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
