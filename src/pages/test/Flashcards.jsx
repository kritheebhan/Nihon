import { useState } from 'react';
import { shuffle } from './testUtils';

export default function Flashcards({ pool, words: rawWords, qtype, onFinish, onBack }) {
  const [cards] = useState(() => shuffle(rawWords));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [showRomaji, setShowRomaji] = useState(false);

  const total = cards.length;
  const done = known.length + unknown.length;

  // Finished
  if (idx >= total) {
    const pct = Math.round((known.length / total) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '😊' : pct >= 50 ? '🙂' : '💪';
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-md">
        <div className="text-5xl mb-3">{emoji}</div>
        <div className="text-2xl font-extrabold mb-1">Flashcards Complete!</div>
        <div className="text-slate-400 mb-6 text-sm">{pct}% mastery rate</div>
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          <div>
            <div className="text-2xl font-extrabold text-green-600">{known.length}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Know It</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-600">{unknown.length}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Need Review</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{total}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Total</div>
          </div>
        </div>

        {unknown.length > 0 && (
          <div className="text-left mb-6">
            <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
              📝 Words to Review ({unknown.length})
            </div>
            {unknown.map((w, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 bg-red-50 text-sm">
                <span className="font-bold text-base">{w.kana || w.kanji}</span>
                <span className="text-slate-400">—</span>
                <span className="font-medium">{w.english}</span>
                <span className="text-slate-300 italic text-xs ml-auto">{w.romaji}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={onBack}
            className="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer bg-slate-50 border-2 border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors">
            ⚙️ New Settings
          </button>
        </div>
      </div>
    );
  }

  const w = cards[idx];
  const isJp2En = qtype !== 'en2jp';
  const front = isJp2En ? (w.kana || w.kanji || '') : (w.english || '');
  const back = isJp2En ? (w.english || '') : (w.kana || w.kanji || '');
  const pct = Math.round((idx / total) * 100);

  const markKnown = () => {
    setKnown(prev => [...prev, w]);
    setIdx(idx + 1);
    setFlipped(false);
  };

  const markUnknown = () => {
    setUnknown(prev => [...prev, w]);
    setIdx(idx + 1);
    setFlipped(false);
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-1 bg-slate-200 rounded-full h-2.5 min-w-[80px]">
          <div className="h-2.5 rounded-full gradient-bar transition-all duration-400" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-400 whitespace-nowrap">{idx + 1} / {total}</span>
        <div className="flex gap-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">✓ {known.length}</span>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600">✗ {unknown.length}</span>
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="bg-white rounded-2xl border-2 border-slate-200 p-10 mb-4 shadow-lg cursor-pointer text-center transition-all hover:shadow-xl hover:border-slate-300 min-h-[240px] flex flex-col items-center justify-center relative select-none"
      >
        {/* Romaji toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowRomaji(prev => !prev); }}
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
            showRomaji ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          {showRomaji ? '👁 Romaji ON' : '👁‍🗨 Romaji OFF'}
        </button>

        <div className="absolute top-3 left-3 text-[0.6rem] uppercase font-bold text-slate-300">
          {flipped ? 'Answer' : 'Question'} • Tap to flip
        </div>

        {!flipped ? (
          <>
            <div className={`font-extrabold mb-2 ${isJp2En ? 'text-4xl' : 'text-2xl'}`}>{front}</div>
            {showRomaji && isJp2En && <div className="text-sm text-slate-400 italic">Romaji: {w.romaji || '?'}</div>}
            {!isJp2En && showRomaji && <div className="text-sm text-slate-400 italic">Romaji: {w.romaji || '?'}</div>}
            <div className="text-slate-300 text-xs mt-3">👆 Tap to reveal answer</div>
          </>
        ) : (
          <>
            <div className="text-sm text-slate-400 mb-1">{front}</div>
            <div className={`font-extrabold text-green-600 ${isJp2En ? 'text-2xl' : 'text-4xl'}`}>{back}</div>
            {isJp2En && w.kanji !== w.kana && (
              <div className="text-sm text-slate-400 mt-1">Kanji: {w.kanji}</div>
            )}
            <div className="text-sm text-slate-400 mt-1 italic">Romaji: {w.romaji || '?'}</div>
          </>
        )}
      </div>

      {/* Action buttons - only show when flipped */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={markUnknown}
            className="py-3 rounded-lg text-sm font-bold cursor-pointer bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100 transition-colors">
            ❌ Don't Know
          </button>
          <button onClick={markKnown}
            className="py-3 rounded-lg text-sm font-bold cursor-pointer bg-green-50 border-2 border-green-200 text-green-600 hover:bg-green-100 transition-colors">
            ✅ Know It!
          </button>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-300 mt-2">
          Tap the card to reveal the answer, then rate yourself
        </div>
      )}
    </div>
  );
}
