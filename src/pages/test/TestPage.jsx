import { useState } from 'react';
import { useData, displayName, getLevel, shuffle } from '../../context/DataContext';
import MultipleChoice from './MultipleChoice';
import MatchCards from './MatchCards';
import Flashcards from './Flashcards';
import TypeAnswer from './TypeAnswer';
import TrueFalse from './TrueFalse';
import SpeedRound from './SpeedRound';

/* ── vocab pool (excludes kanji sections) ───────────────── */
function getVocabPool(data, level, section) {
  const { D = {}, allSecs = [] } = data;
  let pool = [];
  if (section !== 'all') {
    pool = D[section] || [];
  } else {
    allSecs.forEach(s => {
      if (s.includes('Kanji')) return;
      if (level === 'all' || s.startsWith(level)) pool = pool.concat(D[s] || []);
    });
  }
  return pool.filter(w => (w.kana || w.english));
}

/* ── kana pool ──────────────────────────────────────────── */
function getKanaPool(data, script, group) {
  const { HIRA = {}, KATA = {} } = data;
  const src = script === 'hiragana' ? HIRA : KATA;
  const groups = group === 'all'
    ? [...src.basic, ...src.dakuten, ...src.combo]
    : src[group] || [];
  const flat = [];
  groups.forEach(row => row.chars.forEach(ch => flat.push({ kana: ch.c, english: ch.r })));
  return flat;
}

/* ── kanji pool ─────────────────────────────────────────── */
function getKanjiPool(data, level, section, qtype) {
  const { D = {}, n5KanjiSecs = [], n4KanjiSecs = [], n3KanjiSecs = [] } = data;
  const allKanjiSecs = [...n5KanjiSecs, ...n4KanjiSecs, ...n3KanjiSecs];

  let raw = [];
  if (section !== 'all') {
    raw = D[section] || [];
  } else {
    const secs = level === 'all' ? allKanjiSecs
      : level === 'N5' ? n5KanjiSecs
      : level === 'N4' ? n4KanjiSecs
      : n3KanjiSecs;
    secs.forEach(s => { raw = raw.concat(D[s] || []); });
  }
  // Transform so existing game components work:
  // jp2en: show kanji → answer English
  // en2jp: show English → answer kanji
  // kanji2read: show kanji → answer reading (kana)
  return raw
    .filter(w => w.kanji && w.english)
    .map(w => {
      if (qtype === 'en2jp')      return { kana: w.english,  english: w.kanji, _kanji: true };
      if (qtype === 'kanji2read') return { kana: w.kanji,    english: w.kana,  _kanji: true };
      /* jp2en */                  return { kana: w.kanji,    english: w.english, _kanji: true };
    });
}

const MODES = [
  { id: 'choice', icon: '🎯', name: 'Multiple Choice', desc: 'Pick the correct answer from 4 options', color: 'bg-blue-500' },
  { id: 'match',  icon: '🎴', name: 'Match Cards',     desc: 'Match pairs side by side',              color: 'bg-violet-500' },
  { id: 'flash',  icon: '🃏', name: 'Flashcards',      desc: 'Flip to reveal — rate yourself',        color: 'bg-emerald-500' },
  { id: 'type',   icon: '⌨️', name: 'Type Answer',     desc: 'Type the correct answer',               color: 'bg-amber-500' },
  { id: 'tf',     icon: '✅', name: 'True / False',    desc: 'Is the shown meaning correct?',         color: 'bg-rose-500' },
  { id: 'speed',  icon: '⚡', name: 'Speed Round',     desc: '7 seconds per question',                color: 'bg-orange-500' },
];

const CATEGORIES = [
  { id: 'vocab',    label: 'Vocabulary', icon: '📖' },
  { id: 'hiragana', label: 'Hiragana',   icon: '🌸' },
  { id: 'katakana', label: 'Katakana',   icon: '⚡' },
  { id: 'kanji',    label: 'Kanji',      icon: '漢' },
];

export default function TestPage() {
  const data = useData() || {};
  const {
    D = {},
    allSecs = [],
    n5KanjiSecs = [],
    n4KanjiSecs = [],
    n3KanjiSecs = [],
  } = data;

  const allKanjiSecs = [...n5KanjiSecs, ...n4KanjiSecs, ...n3KanjiSecs];

  const [phase, setPhase]         = useState('setup');
  const [category, setCategory]   = useState('vocab');
  const [level, setLevel]         = useState('all');
  const [section, setSection]     = useState('all');
  const [kanaGroup, setKanaGroup] = useState('all');
  const [kanjiLevel, setKanjiLevel] = useState('all');
  const [kanjiSection, setKanjiSection] = useState('all');
  const [qtype, setQtype]         = useState('jp2en');
  const [count, setCount]         = useState(10);
  const [mode, setMode]           = useState('choice');
  const [gamePool, setGamePool]   = useState([]);
  const [gameWords, setGameWords] = useState([]);

  const isKana  = category === 'hiragana' || category === 'katakana';
  const isKanji = category === 'kanji';
  const isVocab = category === 'vocab';

  // Vocab sections (exclude kanji)
  const filteredVocabSections = allSecs.filter(s => {
    if (s.includes('Kanji')) return false;
    if (level === 'all') return D[s] && D[s].length >= 4;
    return s.startsWith(level) && D[s] && D[s].length >= 4;
  });

  // Kanji sections for selector
  const filteredKanjiSections = (() => {
    const base = kanjiLevel === 'all' ? allKanjiSecs
      : kanjiLevel === 'N5' ? n5KanjiSecs
      : kanjiLevel === 'N4' ? n4KanjiSecs
      : n3KanjiSecs;
    return base.filter(s => D[s] && D[s].length >= 4);
  })();

  const startTest = () => {
    let p;
    if (isKana)        p = getKanaPool(data, category, kanaGroup);
    else if (isKanji)  p = getKanjiPool(data, kanjiLevel, kanjiSection, qtype);
    else               p = getVocabPool(data, level, section);

    if (p.length < 4) {
      alert('Not enough items! Please choose a different group.');
      return;
    }
    const n = Math.min(count, p.length);
    const w = shuffle(p).slice(0, n);
    setGamePool(p);
    setGameWords(w);
    setPhase('playing');
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto page-enter">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Test</h2>
          <p className="text-sm text-slate-500">Choose a category and mode</p>
        </div>

        {/* Category toggle */}
        <div className="mb-5">
          <div className="section-label mb-3">Category</div>
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setKanaGroup('all');
                  setSection('all');
                  setKanjiSection('all');
                  setQtype('jp2en');
                }}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 cursor-pointer transition-all text-xs font-semibold ${
                  category === cat.id
                    ? 'border-n5 bg-n5-light text-n5 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`leading-none ${cat.id === 'kanji' ? 'text-xl font-black' : 'text-lg'}`}
                  style={cat.id === 'kanji' ? { fontFamily: 'Noto Sans JP, sans-serif' } : {}}>
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode grid */}
        <div className="mb-5">
          <div className="section-label mb-3">Test Mode</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`text-left p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  mode === m.id
                    ? 'border-n5 bg-n5-light shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center text-sm text-white shrink-0`}>
                    {m.icon}
                  </div>
                  {mode === m.id && (
                    <span className="ml-auto text-[0.55rem] font-bold bg-n5 text-white px-1.5 py-0.5 rounded-md">SELECTED</span>
                  )}
                </div>
                <div className={`text-xs font-semibold mb-0.5 ${mode === m.id ? 'text-n5' : 'text-slate-700'}`}>{m.name}</div>
                <div className="text-[0.68rem] text-slate-400 leading-snug">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="section-label mb-4">Settings</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

            {/* Vocab-only settings */}
            {isVocab && (
              <>
                <div>
                  <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">Level</label>
                  <select
                    value={level}
                    onChange={e => { setLevel(e.target.value); setSection('all'); }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 focus:ring-0 transition-colors cursor-pointer"
                  >
                    <option value="all">All (N5 + N4 + N3)</option>
                    <option value="N5">N5 Only</option>
                    <option value="N4">N4 Only</option>
                    <option value="N3">N3 Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">Section</label>
                  <select
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 transition-colors cursor-pointer"
                  >
                    <option value="all">All Sections</option>
                    {filteredVocabSections.map(s => (
                      <option key={s} value={s}>{getLevel(s)} — {displayName(s)} ({D[s].length})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Kana-only settings */}
            {isKana && (
              <div>
                <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">Group</label>
                <select
                  value={kanaGroup}
                  onChange={e => setKanaGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 transition-colors cursor-pointer"
                >
                  <option value="all">All Groups</option>
                  <option value="basic">Basic (あ→ん)</option>
                  <option value="dakuten">Dakuten / Voiced</option>
                  <option value="combo">Combination</option>
                </select>
              </div>
            )}

            {/* Kanji-only settings */}
            {isKanji && (
              <>
                <div>
                  <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">Level</label>
                  <select
                    value={kanjiLevel}
                    onChange={e => { setKanjiLevel(e.target.value); setKanjiSection('all'); }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 focus:ring-0 transition-colors cursor-pointer"
                  >
                    <option value="all">All (N5 + N4 + N3)</option>
                    <option value="N5">N5 Kanji</option>
                    <option value="N4">N4 Kanji</option>
                    <option value="N3">N3 Kanji</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">Section</label>
                  <select
                    value={kanjiSection}
                    onChange={e => setKanjiSection(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 transition-colors cursor-pointer"
                  >
                    <option value="all">All Sections</option>
                    {filteredKanjiSections.map(s => (
                      <option key={s} value={s}>{getLevel(s)} — {displayName(s)} ({D[s].length})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Shared settings */}
            <div>
              <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">
                {mode === 'match' ? 'Direction' : 'Question Type'}
              </label>
              <select
                value={qtype}
                onChange={e => setQtype(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 transition-colors cursor-pointer"
              >
                {isKana && <>
                  <option value="jp2en">Character → Romaji</option>
                  <option value="en2jp">Romaji → Character</option>
                </>}
                {isKanji && <>
                  <option value="jp2en">Kanji 漢字 → Meaning</option>
                  <option value="en2jp">Meaning → Kanji 漢字</option>
                  <option value="kanji2read">Kanji 漢字 → Reading</option>
                </>}
                {isVocab && <>
                  <option value="jp2en">Japanese → English</option>
                  <option value="en2jp">English → Japanese</option>
                  {mode === 'choice' && <option value="mixed">Mixed</option>}
                </>}
              </select>
            </div>
            <div>
              <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">
                {mode === 'match' ? 'Number of Pairs' : 'Number of Questions'}
              </label>
              <input
                type="number"
                value={count}
                onChange={e => setCount(Math.max(mode === 'match' ? 3 : 5, Math.min(50, parseInt(e.target.value) || 10)))}
                min={mode === 'match' ? 3 : 5}
                max="50"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full py-3 gradient-btn text-white rounded-lg text-sm font-semibold cursor-pointer border-none"
          >
            Start {MODES.find(m2 => m2.id === mode)?.name}
          </button>
        </div>
      </div>
    );
  }

  const commonProps = {
    pool: gamePool,
    words: gameWords,
    qtype,
    category,
    onBack: () => setPhase('setup'),
    onFinish: () => setPhase('setup'),
  };

  // Flash mode: full-width dark container, component owns its own header
  if (mode === 'flash') {
    return (
      <div className="page-enter" style={{ maxWidth: 780, margin: '0 auto' }}>
        <Flashcards {...commonProps} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setPhase('setup')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all cursor-pointer border-none text-xs font-semibold"
        >
          ✕ Exit Test
        </button>
      </div>
      {mode === 'choice' && <MultipleChoice {...commonProps} />}
      {mode === 'match'  && <MatchCards {...commonProps} />}
      {mode === 'type'   && <TypeAnswer {...commonProps} />}
      {mode === 'tf'     && <TrueFalse {...commonProps} />}
      {mode === 'speed'  && <SpeedRound {...commonProps} />}
    </div>
  );
}
