import { useState, useEffect, useRef } from 'react';
import { shuffle } from './testUtils';

export default function MatchCards({ pool, words: rawWords, qtype, onFinish, onBack }) {
  const pairCount = Math.min(6, Math.floor(rawWords.length / 1));
  const selectedWords = useRef(shuffle(rawWords).slice(0, pairCount)).current;

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const lockRef = useRef(false);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 200);
    return () => clearInterval(interval);
  }, [startTime, gameOver]);

  // Build card deck
  useEffect(() => {
    const deck = [];
    selectedWords.forEach((w, i) => {
      deck.push({ id: `jp-${i}`, pairId: i, type: 'jp', text: w.kana || w.kanji || '', sub: w.romaji || '' });
      deck.push({ id: `en-${i}`, pairId: i, type: 'en', text: w.english || '', sub: '' });
    });
    setCards(shuffle(deck));
  }, [selectedWords]);

  const handleClick = (card) => {
    if (lockRef.current) return;
    if (matched.includes(card.pairId)) return;
    if (flipped.find(f => f.id === card.id)) return;

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      lockRef.current = true;

      const [a, b] = newFlipped;
      if (a.pairId === b.pairId && a.type !== b.type) {
        // Match!
        setTimeout(() => {
          const newMatched = [...matched, a.pairId];
          setMatched(newMatched);
          setFlipped([]);
          lockRef.current = false;
          if (newMatched.length === selectedWords.length) {
            setGameOver(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const isFlipped = (card) => flipped.find(f => f.id === card.id) || matched.includes(card.pairId);

  // Determine grid columns based on pair count
  const gridCols = pairCount <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4';

  if (gameOver) {
    const stars = moves <= pairCount ? 3 : moves <= pairCount * 2 ? 2 : 1;
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-md">
        <div className="text-5xl mb-3">{'⭐'.repeat(stars)}</div>
        <div className="text-2xl font-extrabold mb-1">All Matched!</div>
        <div className="text-slate-400 mb-6 text-sm">Great memory skills!</div>
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          <div>
            <div className="text-2xl font-extrabold text-n5">{moves}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Moves</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-n4">{fmtTime(elapsed)}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Time</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{pairCount}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Pairs</div>
          </div>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={onBack}
            className="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer bg-slate-50 border-2 border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors">
            ⚙️ New Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-n5-light text-n5">🎴 {matched.length}/{pairCount} Pairs</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">🔄 {moves} Moves</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">⏱ {fmtTime(elapsed)}</span>
        </div>
        <button onClick={onBack}
          className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors">
          ✕ Quit
        </button>
      </div>

      {/* Card grid */}
      <div className={`grid ${gridCols} gap-3`}>
        {cards.map(card => {
          const revealed = isFlipped(card);
          const isMatched = matched.includes(card.pairId);
          return (
            <button
              key={card.id}
              onClick={() => handleClick(card)}
              className={`relative h-28 sm:h-32 rounded-xl border-2 font-semibold cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-2 text-center ${
                isMatched
                  ? 'bg-green-50 border-green-400 text-green-700 scale-95 opacity-70'
                  : revealed
                  ? card.type === 'jp'
                    ? 'bg-n5-light border-n5 text-n5 shadow-lg scale-105'
                    : 'bg-n4-light border-n4 text-n4 shadow-lg scale-105'
                  : 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-600 text-white hover:from-slate-600 hover:to-slate-800 hover:shadow-md'
              }`}
            >
              {revealed ? (
                <>
                  <span className={`${card.type === 'jp' ? 'text-xl' : 'text-sm'} leading-snug`}>{card.text}</span>
                  {card.sub && <span className="text-[0.6rem] mt-1 opacity-60 italic">{card.sub}</span>}
                  <span className={`absolute top-1.5 right-2 text-[0.55rem] font-bold uppercase ${card.type === 'jp' ? 'text-n5' : 'text-n4'}`}>
                    {card.type === 'jp' ? 'JP' : 'EN'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl mb-0.5">🎴</span>
                  <span className="text-[0.65rem] opacity-60">Click to flip</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
