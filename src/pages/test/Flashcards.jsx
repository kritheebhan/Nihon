import { useState, useEffect, useCallback } from 'react';
import { shuffle as shuffleFn } from './testUtils';

/* ── Icons ───────────────────────────────────────────────── */
function IconSound() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}
function IconUndo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M3 10h10a5 5 0 015 5v0a5 5 0 01-5 5H8M3 10l4-4M3 10l4 4" />
    </svg>
  );
}
function IconShuffle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function IconKeyboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8M6 10v.01M10 10v.01M14 10v.01M18 10v.01" />
    </svg>
  );
}

/* ── Toggle Switch ───────────────────────────────────────── */
function Toggle({ on, onChange, label }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 group"
    >
      <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{label}</span>
      <div
        className="relative inline-flex items-center rounded-full transition-colors duration-200"
        style={{
          width: 44,
          height: 24,
          backgroundColor: on ? '#3b82f6' : '#cbd5e1',
          flexShrink: 0,
        }}
      >
        <div
          className="absolute rounded-full bg-white shadow transition-transform duration-200"
          style={{
            width: 18,
            height: 18,
            transform: on ? 'translateX(22px)' : 'translateX(3px)',
          }}
        />
      </div>
    </button>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function Flashcards({ pool, words: rawWords, qtype, category, onFinish, onBack }) {
  const [cards, setCards] = useState(() => shuffleFn(rawWords));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [learning, setLearning] = useState([]);
  const [history, setHistory] = useState([]);
  const [trackProgress, setTrackProgress] = useState(true);
  const [animDir, setAnimDir] = useState(null); // 'left' | 'right'

  const total = cards.length;
  const isKanji = category === 'kanji';
  const isJp2En = qtype !== 'en2jp';
  const current = cards[idx];

  // front/back based on qtype
  const front = current ? (isJp2En ? (current.kana || current.kanji || '') : (current.english || '')) : '';
  const back  = current ? (isJp2En ? (current.english || '') : (current.kana || current.kanji || '')) : '';
  const showKanjiFont = isKanji && isJp2En;

  const categoryLabel = category === 'kanji'
    ? 'Kanji'
    : category === 'hiragana'
    ? 'Hiragana'
    : category === 'katakana'
    ? 'Katakana'
    : 'Vocabulary';

  const flip = useCallback(() => {
    if (idx < total) setFlipped(f => !f);
  }, [idx, total]);

  const markKnow = useCallback(() => {
    if (idx >= total || !flipped) return;
    setAnimDir('right');
    setTimeout(() => {
      setHistory(h => [...h, { type: 'know', card: current, idx }]);
      setKnown(prev => [...prev, current]);
      setIdx(i => i + 1);
      setFlipped(false);
      setAnimDir(null);
    }, 220);
  }, [idx, total, flipped, current]);

  const markLearning = useCallback(() => {
    if (idx >= total || !flipped) return;
    setAnimDir('left');
    setTimeout(() => {
      setHistory(h => [...h, { type: 'learning', card: current, idx }]);
      setLearning(prev => [...prev, current]);
      setIdx(i => i + 1);
      setFlipped(false);
      setAnimDir(null);
    }, 220);
  }, [idx, total, flipped, current]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    if (last.type === 'know') setKnown(prev => prev.slice(0, -1));
    else setLearning(prev => prev.slice(0, -1));
    setIdx(last.idx);
    setFlipped(false);
  }, [history]);

  const reshuffleCards = useCallback(() => {
    setCards(shuffleFn(rawWords));
    setIdx(0);
    setFlipped(false);
    setKnown([]);
    setLearning([]);
    setHistory([]);
  }, [rawWords]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); flip(); }
      else if (e.key === 'ArrowRight' || e.key === 'l') markKnow();
      else if (e.key === 'ArrowLeft'  || e.key === 'h') markLearning();
      else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); undo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flip, markKnow, markLearning, undo]);

  /* ── Results screen ───────────────────────────────────── */
  if (idx >= total) {
    const pct = total > 0 ? Math.round((known.length / total) * 100) : 0;
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl">
        <div className="bg-white rounded-[1.25rem] border border-slate-200 p-10 text-center max-w-[440px] w-full shadow-lg">
          <div className="text-[3.5rem] mb-3 leading-none">
            {pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}
          </div>
          <div className="text-[1.75rem] font-extrabold text-slate-900 mb-1">
            Round Complete!
          </div>
          <div className="text-[0.85rem] text-slate-500 mb-8">
            {pct}% mastery
          </div>

          <div className="flex justify-center gap-12 mb-8">
            <div>
              <div className="text-[2.25rem] font-extrabold text-emerald-500 leading-none">{known.length}</div>
              <div className="text-[0.7rem] text-emerald-500 font-bold uppercase tracking-wider mt-2">Know</div>
            </div>
            <div>
              <div className="text-[2.25rem] font-extrabold text-orange-500 leading-none">{learning.length}</div>
              <div className="text-[0.7rem] text-orange-500 font-bold uppercase tracking-wider mt-2">Still Learning</div>
            </div>
          </div>

          {learning.length > 0 && (
            <div className="text-left mb-6">
              <div className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-3">
                Words to Review ({learning.length})
              </div>
              <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-1">
                {learning.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-orange-50 border border-orange-100">
                    <span className="font-bold text-slate-900 text-[0.95rem]" style={{ fontFamily: isKanji ? 'Noto Sans JP, sans-serif' : undefined }}>
                      {w.kana || w.kanji}
                    </span>
                    <span className="text-slate-300">—</span>
                    <span className="text-slate-600 text-[0.85rem]">{w.english}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            {learning.length > 0 && (
              <button
                onClick={() => {
                  setCards(shuffleFn(learning));
                  setIdx(0); setFlipped(false);
                  setKnown([]); setLearning([]); setHistory([]);
                }}
                className="px-5 py-2.5 rounded-lg text-[0.85rem] font-bold bg-orange-500 text-white border-none cursor-pointer hover:bg-orange-600 transition-colors shadow-sm"
              >
                Study {learning.length} Again
              </button>
            )}
            <button
              onClick={reshuffleCards}
              className="px-5 py-2.5 rounded-lg text-[0.85rem] font-bold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
            >
              Restart All
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-lg text-[0.85rem] font-bold bg-transparent text-slate-500 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = total > 0 ? (idx / total) * 100 : 0;

  return (
    <div className="min-h-[80vh] flex flex-col select-none relative bg-slate-50/50 rounded-[1.25rem]">
      {/* ── Top Bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 h-[52px]">
        {/* Left spacer so center stays centered */}
        <div className="w-[34px]"></div>

        {/* Center: counter */}
        <div className="text-center absolute left-1/2 -translate-x-1/2 mt-2">
          <div className="text-[0.95rem] font-extrabold text-slate-800 leading-tight">
            {idx + 1} / {total}
          </div>
          <div className="text-[0.72rem] text-slate-500 font-medium">
            {categoryLabel}
          </div>
        </div>

        {/* Right: actions */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-[34px] h-[34px] rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm"
        >
          <IconClose />
        </button>
      </div>

      {/* ── Progress bar ──────────────────────────────────── */}
      <div className="px-5 mb-2 h-2">
        {trackProgress && (
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }} 
            />
          </div>
        )}
      </div>

      {/* ── Still Learning / Know counters ────────────────── */}
      <div className="flex justify-between px-5 mb-4">
        {/* Still Learning */}
        <div className="flex items-center gap-2">
          <div className="min-w-[28px] h-[28px] rounded-full border-2 border-orange-500 flex items-center justify-center text-[0.8rem] font-extrabold text-orange-500 shadow-sm bg-block bg-white">
            {learning.length}
          </div>
          <span className="text-[0.78rem] font-bold text-orange-500 uppercase tracking-tight">Still learning</span>
        </div>

        {/* Know */}
        <div className="flex items-center gap-2">
          <span className="text-[0.78rem] font-bold text-emerald-500 uppercase tracking-tight">Know</span>
          <div className="min-w-[28px] h-[28px] rounded-full border-2 border-emerald-500 flex items-center justify-center text-[0.8rem] font-extrabold text-emerald-500 shadow-sm bg-white">
            {known.length}
          </div>
        </div>
      </div>

      {/* ── Flashcard ─────────────────────────────────────── */}
      <div className="flex-1 px-5 flex flex-col relative z-10">
        {/* Card wrapper with 3D perspective */}
        <div
          onClick={flip}
          className="flex-1 min-h-[340px] cursor-pointer"
          style={{
            perspective: 1200,
            transform: animDir === 'left' ? 'translateX(-40px)' : animDir === 'right' ? 'translateX(40px)' : 'translateX(0)',
            opacity: animDir ? 0 : 1,
            transition: animDir ? 'transform 0.22s ease, opacity 0.22s ease' : 'none',
          }}
        >
          {/* Inner flip container */}
          <div style={{
            width: '100%', height: '100%', minHeight: 340,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {/* ── Front ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg backface-hidden"
                 style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              
              {/* Sound icon top-right */}
              <div className="absolute top-4 right-4 text-slate-300 hover:text-slate-400 transition-colors">
                <IconSound />
              </div>

              {/* Front content */}
              <div
                className="font-extrabold text-center text-slate-800 leading-tight"
                style={{
                  fontSize: showKanjiFont ? '7rem' : isJp2En ? '3.5rem' : '2.5rem',
                  fontFamily: (showKanjiFont || (isJp2En && !isKanji)) ? 'Noto Sans JP, sans-serif' : undefined,
                }}
              >
                {front}
              </div>

              {current?.romaji && !isKanji && (
                <div className="mt-3 text-[0.95rem] text-slate-400 italic">
                  {current.romaji}
                </div>
              )}

              {/* Subtle hint at bottom */}
              <div className="absolute bottom-4 text-[0.72rem] text-slate-300 font-medium tracking-wide">
                Click or press Space to flip
              </div>
            </div>

            {/* ── Back ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-lg backface-hidden"
                 style={{ 
                   backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                   transform: 'rotateY(180deg)',
                 }}>
              
              {/* Front text as subtitle */}
              <div className="text-slate-400 font-semibold text-center mb-4"
                   style={{
                     fontSize: showKanjiFont ? '2rem' : isJp2En ? '1.5rem' : '1.1rem',
                     fontFamily: (showKanjiFont || (isJp2En && !isKanji)) ? 'Noto Sans JP, sans-serif' : undefined,
                   }}>
                {front}
              </div>

              {/* Divider */}
              <div className="w-[48px] h-0.5 rounded-full bg-slate-200 mb-6" />

              {/* Main answer */}
              <div className="font-extrabold text-center text-slate-900 leading-tight mb-2"
                   style={{
                     fontSize: !isJp2En ? '5rem' : '2.5rem',
                     fontFamily: !isJp2En ? 'Noto Sans JP, sans-serif' : undefined,
                   }}>
                {back}
              </div>

              {current?.romaji && !isKanji && (
                <div className="text-[0.9rem] text-slate-500 italic mt-1">
                  {current.romaji}
                </div>
              )}

              {/* Kanji extra info on back */}
              {isKanji && isJp2En && (current?.onReading || current?.kunReading) && (
                <div className="mt-4 flex flex-col items-center gap-1.5 pt-4 border-t border-slate-200">
                  {current.onReading && (
                    <div className="text-[0.85rem] text-slate-600">
                      <span className="font-bold mr-2 text-slate-400">音</span>
                      <span style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{current.onReading}</span>
                    </div>
                  )}
                  {current.kunReading && (
                    <div className="text-[0.85rem] text-slate-600">
                      <span className="font-bold mr-2 text-slate-400">訓</span>
                      <span style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>{current.kunReading}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Shortcut hint bar ─────────────────────────── */}
        <div className="mt-4 px-5 py-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[0.78rem] font-medium text-slate-500 shadow-sm relative z-0">
          <IconKeyboard />
          <span className="font-bold text-slate-700">Shortcut</span>
          <span>Press</span>
          <kbd className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded shadow-sm text-[0.75rem] font-mono text-slate-600">Space</kbd>
          <span>or click on the card to flip</span>
        </div>
      </div>

      {/* ── Bottom Controls ───────────────────────────────── */}
      <div className="p-5 flex items-center justify-between gap-4 mt-2">
        {/* Track progress toggle */}
        <Toggle
          on={trackProgress}
          onChange={() => setTrackProgress(p => !p)}
          label="Track progress"
        />

        {/* X / ✓ action buttons */}
        <div className="flex gap-3">
          <button
            onClick={markLearning}
            disabled={!flipped}
            title="Still learning (← Arrow)"
            className={`w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${flipped 
                ? 'bg-white border-orange-500 text-orange-500 hover:bg-orange-50 cursor-pointer shadow-md' 
                : 'bg-slate-50 border-slate-200 text-slate-300 cursor-default'}`}
          >
            <IconX />
          </button>
          <button
            onClick={markKnow}
            disabled={!flipped}
            title="Know it (→ Arrow)"
            className={`w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${flipped 
                ? 'bg-white border-emerald-500 text-emerald-500 hover:bg-emerald-50 cursor-pointer shadow-md' 
                : 'bg-slate-50 border-slate-200 text-slate-300 cursor-default'}`}
          >
            <IconCheck />
          </button>
        </div>

        {/* Undo + Shuffle */}
        <div className="flex gap-1.5">
          <button
            onClick={undo}
            disabled={history.length === 0}
            title="Undo (Ctrl+Z)"
            className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center transition-colors border-none
              ${history.length === 0 
                ? 'text-slate-300 bg-transparent cursor-default' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200 bg-slate-100 cursor-pointer shadow-sm'}`}
          >
            <IconUndo />
          </button>
          <button
            onClick={reshuffleCards}
            title="Shuffle & restart"
            className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 bg-slate-100 border-none hover:bg-slate-200 cursor-pointer transition-colors shadow-sm"
          >
            <IconShuffle />
          </button>
        </div>
      </div>
    </div>
  );
}
