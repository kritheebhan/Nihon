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
  return raw
    .filter(w => w.kanji && w.english)
    .map(w => {
      if (qtype === 'en2jp') return { kana: w.english, english: w.kanji, _kanji: true };
      if (qtype === 'kanji2read') return { kana: w.kanji, english: w.kana, _kanji: true };
      /* jp2en */                  return { kana: w.kanji, english: w.english, _kanji: true };
    });
}

const MODES = [
  { id: 'choice', icon: '🎯', name: 'Multiple Choice', desc: 'Pick the correct answer from 4 options. Perfect for beginners!', color: '#3b82f6' },
  { id: 'match', icon: '🎴', name: 'Match Cards', desc: 'Match Japanese words with their meanings side by side.', color: '#8b5cf6' },
  { id: 'flash', icon: '🃏', name: 'Flashcards', desc: 'Flip cards to reveal answers. Rate yourself as you go.', color: '#10b981' },
  { id: 'type', icon: '⌨️', name: 'Type Answer', desc: 'Type the correct translation. Test your spelling skills!', color: '#f59e0b' },
  { id: 'tf', icon: '✅', name: 'True / False', desc: 'Is the shown meaning correct? Quick and sharp practice.', color: '#ef4444' },
  { id: 'speed', icon: '⚡', name: 'Speed Round', desc: 'Race against the clock! Only 7 seconds per question.', color: '#f97316' },
];

const CATEGORIES = [
  { id: 'vocab', label: 'Vocabulary', icon: '📖' },
  { id: 'hiragana', label: 'Hiragana', icon: '🌸' },
  { id: 'katakana', label: 'Katakana', icon: '⚡' },
  { id: 'kanji', label: 'Kanji', icon: '漢' },
];

/* ── CSS ──────────────────────────────────────────────── */
const CSS = `
@keyframes tdFadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tdFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
@keyframes tdPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.3); }
  50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
}
.td-anim-1 { animation: tdFadeUp 0.45s ease 0.05s both; }
.td-anim-2 { animation: tdFadeUp 0.45s ease 0.15s both; }
.td-anim-3 { animation: tdFadeUp 0.45s ease 0.25s both; }
.td-anim-4 { animation: tdFadeUp 0.45s ease 0.35s both; }
.td-mode-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.td-mode-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.1); }
.td-play-btn { transition: all 0.2s ease; }
.td-play-btn:hover { transform: scale(1.03); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
.td-play-btn:active { transform: scale(0.97); }
.td-cat-pill { transition: all 0.2s ease; }
.td-cat-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.td-select:focus { border-color: #3b82f6; outline: none; background: #fff; }
@media (max-width: 768px) {
  .td-hero-grid { flex-direction: column !important; }
  .td-hero-sidebar { width: 100% !important; }
  .td-modes-grid { grid-template-columns: 1fr !important; }
}
`;

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

  const [phase, setPhase] = useState('setup');
  const [category, setCategory] = useState('vocab');
  const [level, setLevel] = useState('all');
  const [section, setSection] = useState('all');
  const [kanaGroup, setKanaGroup] = useState('all');
  const [kanjiLevel, setKanjiLevel] = useState('all');
  const [kanjiSection, setKanjiSection] = useState('all');
  const [qtype, setQtype] = useState('jp2en');
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState('choice');
  const [gamePool, setGamePool] = useState([]);
  const [gameWords, setGameWords] = useState([]);

  const isKana = category === 'hiragana' || category === 'katakana';
  const isKanji = category === 'kanji';
  const isVocab = category === 'vocab';

  const filteredVocabSections = allSecs.filter(s => {
    if (s.includes('Kanji')) return false;
    if (level === 'all') return D[s] && D[s].length >= 4;
    return s.startsWith(level) && D[s] && D[s].length >= 4;
  });

  const filteredKanjiSections = (() => {
    const base = kanjiLevel === 'all' ? allKanjiSecs
      : kanjiLevel === 'N5' ? n5KanjiSecs
        : kanjiLevel === 'N4' ? n4KanjiSecs
          : n3KanjiSecs;
    return base.filter(s => D[s] && D[s].length >= 4);
  })();

  const startTest = () => {
    let p;
    if (isKana) p = getKanaPool(data, category, kanaGroup);
    else if (isKanji) p = getKanjiPool(data, kanjiLevel, kanjiSection, qtype);
    else p = getVocabPool(data, level, section);

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

  /* ── Playing phase ── */
  if (phase !== 'setup') {
    const commonProps = {
      pool: gamePool, words: gameWords, qtype, category,
      onBack: () => setPhase('setup'),
      onFinish: () => setPhase('setup'),
    };

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
        {mode === 'match' && <MatchCards {...commonProps} />}
        {mode === 'type' && <TypeAnswer {...commonProps} />}
        {mode === 'tf' && <TrueFalse {...commonProps} />}
        {mode === 'speed' && <SpeedRound {...commonProps} />}
      </div>
    );
  }

  /* ── Setup phase ── */
  const selectedMode = MODES.find(m => m.id === mode);

  // pool sizes for the sidebar
  const vocabCount = allSecs.filter(s => !s.includes('Kanji')).reduce((n, s) => n + (D[s]?.length || 0), 0);
  const kanjiCount = allKanjiSecs.reduce((n, s) => n + (D[s]?.length || 0), 0);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif' }} className="page-enter">
      <style>{CSS}</style>

      {/* ═══════════════════════════════════════════
          HERO BANNER — "Quiz of the Day" style
          ═══════════════════════════════════════════ */}
      <div className="td-anim-1" style={{
        display: 'flex', gap: 20, alignItems: 'stretch',
      }}>
        {/* ── Main hero card ── */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #60a5fa 100%)',
          borderRadius: 22,
          padding: '36px 34px 30px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 220,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* floating kanji bg */}
          <div style={{ position: 'absolute', right: 20, top: 12, opacity: 0.07, pointerEvents: 'none', userSelect: 'none' }}>
            <span style={{ fontSize: '10rem', fontWeight: 900, fontFamily: '"Noto Sans JP", sans-serif', lineHeight: 1 }}>試</span>
          </div>
          {/* floating ? marks */}
          <div style={{ position: 'absolute', right: 60, top: 20, animation: 'tdFloat 4s ease-in-out infinite', opacity: 0.15 }}>
            <span style={{ fontSize: '3rem' }}>❓</span>
          </div>
          <div style={{ position: 'absolute', right: 160, top: 50, animation: 'tdFloat 5s ease-in-out 0.5s infinite', opacity: 0.1 }}>
            <span style={{ fontSize: '2rem' }}>❓</span>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 12,
              letterSpacing: '-0.02em',
            }}>
              Test Your<br />Japanese
            </h1>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, opacity: 0.85, maxWidth: 380, marginBottom: 16 }}>
              Challenge yourself with {MODES.length} different quiz modes.
              {isVocab ? ` ${vocabCount.toLocaleString()} vocabulary words available!` : isKanji ? ` ${kanjiCount.toLocaleString()} kanji to practice!` : ' Master your kana!'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.72rem', fontWeight: 600, opacity: 0.7, marginBottom: 18 }}>
              <span>Modes: <strong style={{ opacity: 1, color: '#fff' }}>{MODES.length}</strong></span>
              <span>·</span>
              <span>Questions: <strong style={{ opacity: 1, color: '#fff' }}>{count}</strong></span>
              <span>·</span>
              <span>Type: <strong style={{ opacity: 1, color: '#fff' }}>{qtype === 'jp2en' ? 'JP→EN' : qtype === 'en2jp' ? 'EN→JP' : '漢→読'}</strong></span>
            </div>
          </div>

          <button
            onClick={startTest}
            className="td-play-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 50, border: '2px solid rgba(255,255,255,0.3)',
              background: '#fff', color: '#2563eb', fontSize: '0.85rem', fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
              alignSelf: 'flex-start', zIndex: 2,
            }}
          >
            ▶ Play Now
          </button>
        </div>

        {/* ── Sidebar — Settings panel ── */}
        <div className="td-hero-sidebar" style={{
          width: 260, flexShrink: 0,
          background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          padding: '18px 16px',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b' }}>Settings</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '3px 8px', borderRadius: 6 }}>
              {selectedMode?.name}
            </span>
          </div>

          {/* Category quick select */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Category</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setKanaGroup('all'); setSection('all'); setKanjiSection('all'); setQtype('jp2en'); }}
                  style={{
                    padding: '7px 0', borderRadius: 10, border: `2px solid ${category === cat.id ? '#3b82f6' : '#e2e8f0'}`,
                    background: category === cat.id ? '#eff6ff' : '#f8fafc',
                    fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    color: category === cat.id ? '#2563eb' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* context-specific selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {isVocab && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Level</label>
                  <select value={level} onChange={e => { setLevel(e.target.value); setSection('all'); }}
                    className="td-select"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.72rem', color: '#334155', background: '#f8fafc', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                    <option value="all">All (N5+N4+N3)</option>
                    <option value="N5">N5 Only</option>
                    <option value="N4">N4 Only</option>
                    <option value="N3">N3 Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Section</label>
                  <select value={section} onChange={e => setSection(e.target.value)}
                    className="td-select"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.72rem', color: '#334155', background: '#f8fafc', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                    <option value="all">All Sections</option>
                    {filteredVocabSections.map(s => (
                      <option key={s} value={s}>{getLevel(s)} — {displayName(s)} ({D[s].length})</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {isKana && (
              <div>
                <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Group</label>
                <select value={kanaGroup} onChange={e => setKanaGroup(e.target.value)}
                  className="td-select"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.72rem', color: '#334155', background: '#f8fafc', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <option value="all">All Groups</option>
                  <option value="basic">Basic (あ→ん)</option>
                  <option value="dakuten">Dakuten / Voiced</option>
                  <option value="combo">Combination</option>
                </select>
              </div>
            )}
            {isKanji && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Level</label>
                  <select value={kanjiLevel} onChange={e => { setKanjiLevel(e.target.value); setKanjiSection('all'); }}
                    className="td-select"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.72rem', color: '#334155', background: '#f8fafc', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                    <option value="all">All (N5+N4+N3)</option>
                    <option value="N5">N5 Kanji</option>
                    <option value="N4">N4 Kanji</option>
                    <option value="N3">N3 Kanji</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Section</label>
                  <select value={kanjiSection} onChange={e => setKanjiSection(e.target.value)}
                    className="td-select"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.72rem', color: '#334155', background: '#f8fafc', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                    <option value="all">All Sections</option>
                    {filteredKanjiSections.map(s => (
                      <option key={s} value={s}>{getLevel(s)} — {displayName(s)} ({D[s].length})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* shared */}
            <div>
              <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {mode === 'match' ? 'Direction' : 'Question Type'}
              </label>
              <select value={qtype} onChange={e => setQtype(e.target.value)}
                className="td-select"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.72rem', color: '#334155', background: '#f8fafc', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                {isKana && <><option value="jp2en">Character → Romaji</option><option value="en2jp">Romaji → Character</option></>}
                {isKanji && <><option value="jp2en">Kanji → Meaning</option><option value="en2jp">Meaning → Kanji</option><option value="kanji2read">Kanji → Reading</option></>}
                {isVocab && <><option value="jp2en">Japanese → English</option><option value="en2jp">English → Japanese</option>{mode === 'choice' && <option value="mixed">Mixed</option>}</>}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {mode === 'match' ? 'Pairs' : 'Questions'}
              </label>
              <input type="number" value={count}
                onChange={e => setCount(Math.max(mode === 'match' ? 3 : 5, Math.min(50, parseInt(e.target.value) || 10)))}
                min={mode === 'match' ? 3 : 5} max="50"
                className="td-select"
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.72rem', color: '#334155', background: '#f8fafc', fontWeight: 500, fontFamily: 'inherit' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MODE CARDS — "Featured Quizzes" style
          ═══════════════════════════════════════════ */}
      <div className="td-anim-3" style={{ marginTop: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="td-modes-grid">
          {MODES.map(m => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="td-mode-card"
                style={{
                  textAlign: 'left',
                  padding: '22px 20px 18px',
                  borderRadius: 18,
                  border: active ? `2.5px solid ${m.color}` : '2.5px solid #e8ecf1',
                  background: active ? '#fff' : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* active indicator dot */}
                {active && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 10, height: 10, borderRadius: '50%',
                    background: m.color, boxShadow: `0 0 0 3px ${m.color}22`,
                  }} />
                )}

                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: `${m.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', marginBottom: 14,
                }}>
                  {m.icon}
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', marginBottom: 6, lineHeight: 1.2 }}>
                  {m.name}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748b', lineHeight: 1.5 }}>
                  {m.desc}
                </div>

                {/* Play Now btn at bottom */}
                <div style={{
                  marginTop: 14,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '7px 16px', borderRadius: 50,
                  background: active ? m.color : '#f1f5f9',
                  color: active ? '#fff' : '#475569',
                  fontSize: '0.65rem', fontWeight: 700,
                  transition: 'all 0.15s ease',
                }}>
                  {active ? '▶ Play Now' : 'Select'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          BOTTOM FEATURE ROW — 3 cards
          ═══════════════════════════════════════════ */}
      <div className="td-anim-4" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 18,
      }}>
        {/* Popular mode highlight */}
        <div style={{
          background: '#fff', borderRadius: 18, border: '1px solid #e8ecf1',
          padding: '22px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: 6, lineHeight: 1.2 }}>
            Today's Challenge
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5, fontWeight: 500, marginBottom: 14 }}>
            Quick 10-question vocabulary quiz. Test how well you know your JLPT words!
          </p>
          <button
            onClick={() => { setCategory('vocab'); setMode('choice'); setCount(10); setQtype('jp2en'); startTest(); }}
            className="td-play-btn"
            style={{
              padding: '8px 20px', borderRadius: 50, border: 'none',
              background: '#fbbf24', color: '#78350f', fontSize: '0.7rem',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Play Now
          </button>
        </div>

        {/* Speed challenge */}
        <div style={{
          background: '#fff', borderRadius: 18, border: '1px solid #e8ecf1',
          padding: '22px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: 6, lineHeight: 1.2 }}>
            Speed Challenge ⚡
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5, fontWeight: 500, marginBottom: 14 }}>
            Race against the clock! Complete as many questions as you can with only 7 seconds each.
          </p>
          <button
            onClick={() => { setMode('speed'); setCount(15); }}
            className="td-play-btn"
            style={{
              padding: '8px 20px', borderRadius: 50, border: 'none',
              background: '#3b82f6', color: '#fff', fontSize: '0.7rem',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Play Now
          </button>
        </div>

        {/* CTA / yellow card */}
        <div style={{
          background: '#fef08a', borderRadius: 18,
          padding: '22px 20px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', lineHeight: 1.25, marginBottom: 6 }}>
            Study Every Day!
          </div>
          <p style={{ fontSize: '0.7rem', color: '#713f12', lineHeight: 1.5, fontWeight: 500, marginBottom: 14 }}>
            Consistent practice is the key to mastering Japanese. Try flashcards today!
          </p>
          <button
            onClick={() => { setMode('flash'); }}
            className="td-play-btn"
            style={{
              padding: '8px 20px', borderRadius: 50, border: '2px solid #ca8a04',
              background: 'transparent', color: '#854d0e', fontSize: '0.7rem',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              alignSelf: 'flex-start',
            }}
          >
            Open Flashcards
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          CATEGORIES — pill row
          ═══════════════════════════════════════════ */}
      <div className="td-anim-4" style={{ marginTop: 22, marginBottom: 10 }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Categories</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { label: 'Vocabulary', id: 'vocab' },
            { label: 'Hiragana', id: 'hiragana' },
            { label: 'Katakana', id: 'katakana' },
            { label: 'Kanji', id: 'kanji' },
            { label: 'N5 Level', id: 'n5' },
            { label: 'N4 Level', id: 'n4' },
            { label: 'N3 Level', id: 'n3' },
            { label: 'Mixed Mode', id: 'mixed' },
          ].map(c => {
            const isActive = (c.id === category) || (c.id === 'n5' && level === 'N5') || (c.id === 'n4' && level === 'N4') || (c.id === 'n3' && level === 'N3');
            return (
              <button
                key={c.id}
                onClick={() => {
                  if (['vocab', 'hiragana', 'katakana', 'kanji'].includes(c.id)) {
                    setCategory(c.id); setKanaGroup('all'); setSection('all'); setKanjiSection('all'); setQtype('jp2en');
                  } else if (c.id === 'n5') { setCategory('vocab'); setLevel('N5'); }
                  else if (c.id === 'n4') { setCategory('vocab'); setLevel('N4'); }
                  else if (c.id === 'n3') { setCategory('vocab'); setLevel('N3'); }
                  else if (c.id === 'mixed') { setQtype('mixed'); setMode('choice'); }
                }}
                className="td-cat-pill"
                style={{
                  padding: '8px 18px', borderRadius: 50,
                  border: `1.5px solid ${isActive ? '#3b82f6' : '#e2e8f0'}`,
                  background: isActive ? '#eff6ff' : '#fff',
                  color: isActive ? '#2563eb' : '#475569',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
