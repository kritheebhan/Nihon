import { useState } from 'react';
import { D, allSecs, displayName, getLevel, shuffle } from '../../data';
import MultipleChoice from './MultipleChoice';
import MatchCards from './MatchCards';
import Flashcards from './Flashcards';
import TypeAnswer from './TypeAnswer';
import TrueFalse from './TrueFalse';
import SpeedRound from './SpeedRound';

function getPool(level, section) {
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

const MODES = [
  {
    id: 'choice',
    icon: '🎯',
    name: 'Multiple Choice',
    desc: 'Pick the correct answer from 4 options',
    color: 'bg-blue-500',
  },
  {
    id: 'match',
    icon: '🎴',
    name: 'Match Cards',
    desc: 'Match Japanese and English pairs',
    color: 'bg-violet-500',
  },
  {
    id: 'flash',
    icon: '🃏',
    name: 'Flashcards',
    desc: 'Flip to reveal — rate yourself',
    color: 'bg-emerald-500',
  },
  {
    id: 'type',
    icon: '⌨️',
    name: 'Type Answer',
    desc: 'Type the correct translation',
    color: 'bg-amber-500',
  },
  {
    id: 'tf',
    icon: '✅',
    name: 'True / False',
    desc: 'Is the shown meaning correct?',
    color: 'bg-rose-500',
  },
  {
    id: 'speed',
    icon: '⚡',
    name: 'Speed Round',
    desc: '7 seconds per question',
    color: 'bg-orange-500',
  },
];

export default function TestPage() {
  const [phase, setPhase]     = useState('setup');
  const [level, setLevel]     = useState('all');
  const [section, setSection] = useState('all');
  const [qtype, setQtype]     = useState('jp2en');
  const [count, setCount]     = useState(10);
  const [mode, setMode]       = useState('choice');
  const [gamePool, setGamePool]   = useState([]);
  const [gameWords, setGameWords] = useState([]);

  const filteredSections = allSecs.filter(s => {
    if (level === 'all') return D[s] && D[s].length >= 4;
    return s.startsWith(level) && D[s] && D[s].length >= 4;
  });

  const startTest = () => {
    const p = getPool(level, section);
    if (p.length < 4) {
      alert('Not enough words! Please choose a different section.');
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
      <div className="max-w-2xl page-enter">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Vocabulary Test</h2>
          <p className="text-sm text-slate-500">Choose a mode and configure your session</p>
        </div>

        {/* Mode grid */}
        <div className="mb-6">
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
            <div>
              <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">Level</label>
              <select
                value={level}
                onChange={e => { setLevel(e.target.value); setSection('all'); }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 focus:ring-0 transition-colors cursor-pointer"
              >
                <option value="all">All (N5 + N4)</option>
                <option value="N5">N5 Only</option>
                <option value="N4">N4 Only</option>
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
                {filteredSections.map(s => (
                  <option key={s} value={s}>{getLevel(s)} — {displayName(s)} ({D[s].length})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[0.72rem] font-semibold text-slate-500 mb-1.5">
                {mode === 'match' ? 'Direction' : 'Question Type'}
              </label>
              <select
                value={qtype}
                onChange={e => setQtype(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:border-n5 transition-colors cursor-pointer"
              >
                <option value="jp2en">Japanese → English</option>
                <option value="en2jp">English → Japanese</option>
                {mode === 'choice' && <option value="mixed">Mixed</option>}
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
    onBack: () => setPhase('setup'),
    onFinish: () => setPhase('setup'),
  };

  return (
    <div className="max-w-2xl page-enter">
      {mode === 'choice' && <MultipleChoice {...commonProps} />}
      {mode === 'match'  && <MatchCards {...commonProps} />}
      {mode === 'flash'  && <Flashcards {...commonProps} />}
      {mode === 'type'   && <TypeAnswer {...commonProps} />}
      {mode === 'tf'     && <TrueFalse {...commonProps} />}
      {mode === 'speed'  && <SpeedRound {...commonProps} />}
    </div>
  );
}
