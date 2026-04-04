import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

/* ─── Study set cards ────────────────────────────── */
const STUDY_SETS = [
  {
    id: 'n5-vocab',
    title: 'JLPT N5 Vocabulary',
    subtitle: 'Core beginner words',
    countKey: 'n5',
    to: '/app/vocabulary',
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    icon: '📖',
    studiers: 42,
  },
  {
    id: 'n4-vocab',
    title: 'JLPT N4 Vocabulary',
    subtitle: 'Upper beginner words',
    countKey: 'n4',
    to: '/app/vocabulary',
    accent: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
    icon: '📚',
    studiers: 28,
  },
  {
    id: 'n5-kanji',
    title: 'JLPT N5 Kanji',
    subtitle: 'Essential characters',
    countKey: 'kanji',
    to: '/app/kanji',
    accent: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconBg: 'bg-rose-100',
    icon: '漢',
    studiers: 35,
    iconJa: true,
  },
  {
    id: 'grammar',
    title: 'N5 + N4 Grammar',
    subtitle: 'Sentence patterns',
    countKey: 'grammar',
    to: '/app/grammar',
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    icon: '文',
    studiers: 19,
    iconJa: true,
  },
  {
    id: 'hiragana',
    title: 'Hiragana',
    subtitle: '104 characters',
    static: 104,
    unit: 'chars',
    to: '/app/hiragana',
    accent: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconBg: 'bg-violet-100',
    icon: 'あ',
    studiers: 61,
    iconJa: true,
  },
  {
    id: 'katakana',
    title: 'Katakana',
    subtitle: '107 characters',
    static: 107,
    unit: 'chars',
    to: '/app/katakana',
    accent: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    iconBg: 'bg-cyan-100',
    icon: 'ア',
    studiers: 44,
    iconJa: true,
  },
];

/* ─── Quick tests ────────────────────────────────── */
const QUICK_TESTS = [
  {
    label: 'N5 Kanji Quiz',
    desc: 'Test your kanji recognition',
    to: '/app/test',
    emoji: '漢',
    accent: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconJa: true,
  },
  {
    label: 'N5 Vocabulary Quiz',
    desc: 'Match Japanese to English',
    to: '/app/test',
    emoji: '📝',
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    label: 'N4 Challenge',
    desc: 'Upper beginner level test',
    to: '/app/test',
    emoji: '🎯',
    accent: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    label: 'Hiragana Practice',
    desc: 'Read hiragana characters',
    to: '/app/hiragana',
    emoji: 'あ',
    accent: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconJa: true,
  },
  {
    label: 'Grammar Patterns',
    desc: 'N5 + N4 sentence structures',
    to: '/app/grammar',
    emoji: '文',
    accent: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconJa: true,
  },
  {
    label: 'Mixed Flashcards',
    desc: 'Random vocab from all levels',
    to: '/app/test',
    emoji: '🃏',
    accent: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
  },
];

/* ─── Big Study Set Card (Quizlet style) ─────────── */
function SetCard({ set, counts }) {
  const count = set.static ??
    (set.countKey === 'n5' ? counts.n5 :
     set.countKey === 'n4' ? counts.n4 :
     set.countKey === 'kanji' ? counts.kanji :
     set.countKey === 'grammar' ? counts.grammar : 0);

  return (
    <Link
      to={set.to}
      className={`no-underline group shrink-0 w-64 sm:w-72 bg-white rounded-2xl border ${set.border} shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden flex flex-col`}
      style={{ minHeight: '200px' }}
    >
      {/* Top section — icon area */}
      <div className={`${set.bg} px-5 pt-5 pb-4 flex-1 relative`}>
        {/* studiers pill */}
        <div className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-2.5 py-1 mb-4 border border-white/80">
          <svg viewBox="0 0 16 16" fill="currentColor" className={`w-3 h-3 ${set.accent}`}>
            <path d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V3.5ZM6 3.5a2 2 0 1 1 4 0V4H6V3.5ZM5 5h6v3H5V5Z"/>
          </svg>
          <span className="text-[0.6rem] font-bold text-slate-500">↗ {set.studiers} studying today</span>
        </div>

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl ${set.iconBg} ${set.accent} flex items-center justify-center font-black text-2xl leading-none shadow-sm`}
          style={set.iconJa ? { fontFamily: 'Noto Sans JP, serif' } : {}}
        >
          {set.icon}
        </div>
      </div>

      {/* Bottom section — title + count */}
      <div className="px-5 py-4 bg-white">
        <div className="text-base font-bold text-slate-900 leading-tight mb-1">{set.title}</div>
        <div className="text-xs text-slate-500">{count} {set.unit || 'cards'}</div>
      </div>
    </Link>
  );
}

/* ─── Quick Test Card ────────────────────────────── */
function TestCard({ test }) {
  return (
    <Link
      to={test.to}
      className={`no-underline group flex items-center gap-3 p-4 rounded-xl bg-white border ${test.border} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
    >
      <div
        className={`w-10 h-10 rounded-xl ${test.bg} ${test.accent} flex items-center justify-center shrink-0 font-black text-lg leading-none`}
        style={test.iconJa ? { fontFamily: 'Noto Sans JP, serif' } : {}}
      >
        {test.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-slate-800">{test.label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{test.desc}</div>
      </div>
      <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${test.accent} opacity-40 group-hover:opacity-80 transition-opacity shrink-0`}>
        <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
      </svg>
    </Link>
  );
}

/* ─── Scroll Arrow Button ────────────────────────── */
function ScrollArrow({ dir, onClick, visible }) {
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:shadow-lg transition-all cursor-pointer"
      style={{ [dir === 'left' ? 'left' : 'right']: '-16px' }}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${dir === 'left' ? 'rotate-180' : ''}`}>
        <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
      </svg>
    </button>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────── */
export default function HomePage() {
  const {
    D = {}, n5VocabSecs = [], n4VocabSecs = [],
    kanjiTotal = 0, GRAMMAR = []
  } = useData() || {};
  const { user } = useAuth();

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const n5 = n5VocabSecs.reduce((s, k) => s + ((D[k] || []).length || 0), 0);
  const n4 = n4VocabSecs.reduce((s, k) => s + ((D[k] || []).length || 0), 0);
  const counts = { n5, n4, kanji: kanjiTotal, grammar: GRAMMAR.length, total: n5 + n4 };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'おはようございます' : hour < 18 ? 'こんにちは' : 'こんばんは';
  const greetingEn = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  if (!D || Object.keys(D).length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto page-enter">

      {/* ── Hero ─────────────────────────────────── */}
      <div className="hero-bg rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">
          {greetingEn}, <span className="text-white">{user?.name || 'Learner'}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 leading-tight" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
          {greeting} 👋
        </h1>
        <p className="text-blue-200 text-xs sm:text-sm mb-5 max-w-md">Your complete JLPT study dashboard</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { value: counts.total, label: 'Vocabulary' },
            { value: counts.kanji, label: 'Kanji' },
            { value: counts.n5, label: 'N5 Words' },
            { value: counts.grammar, label: 'Grammar' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-white">{value}</div>
              <div className="text-[0.62rem] sm:text-[0.68rem] font-medium text-blue-200 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Study Sets ───────────────────────────── */}
      <div className="mb-7">
        <div className="mb-4">
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Because you studied this content</p>
          <h2 className="text-lg font-black text-slate-900">JLPT Study Sets</h2>
        </div>

        {/* Scrollable row with arrows */}
        <div className="relative">
          <ScrollArrow dir="left" onClick={() => scrollBy('left')} visible={canScrollLeft} />
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3 no-scrollbar"
            onScroll={checkScroll}
          >
            {STUDY_SETS.map(set => (
              <SetCard key={set.id} set={set} counts={counts} />
            ))}
          </div>
          <ScrollArrow dir="right" onClick={() => scrollBy('right')} visible={canScrollRight} />
        </div>
      </div>

      {/* ── Quick Practice ────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Keep things fresh</p>
            <h2 className="text-lg font-black text-slate-900">Quick Practice</h2>
          </div>
          <Link to="/app/test" className="no-underline text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            All tests →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_TESTS.map(test => (
            <TestCard key={test.label} test={test} />
          ))}
        </div>
      </div>

    </div>
  );
}
