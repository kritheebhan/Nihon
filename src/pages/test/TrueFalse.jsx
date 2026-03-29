import { useState } from 'react';
import { shuffle } from './testUtils';

export default function TrueFalse({ pool, words: rawWords, qtype, onFinish, onBack }) {
  const [cards] = useState(() => shuffle(rawWords));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState({ c: 0, w: 0 });
  const [wrong, setWrong] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // true | false
  const [pair, setPair] = useState(() => makePair(shuffle(rawWords), 0, pool, qtype));
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const total = cards.length;

  function makePair(wordsList, index, pool, qtype) {
    const w = wordsList[index];
    const isJp2En = qtype !== 'en2jp';
    const isCorrect = Math.random() > 0.5;
    let displayed;
    if (isCorrect) {
      displayed = isJp2En ? (w.english || '') : (w.kana || w.kanji || '');
    } else {
      const other = shuffle(pool.filter(x => x !== w))[0];
      displayed = other ? (isJp2En ? (other.english || '') : (other.kana || other.kanji || '')) : (isJp2En ? (w.english || '') : (w.kana || w.kanji || ''));
    }
    return { w, displayed, isCorrect, isJp2En };
  }

  // Finished
  if (idx >= total) {
    const pct = Math.round((score.c / total) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '😊' : pct >= 50 ? '🙂' : '💪';
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-md">
        <div className="text-5xl mb-3">{emoji}</div>
        <div className="text-4xl font-extrabold mb-1">{pct}%</div>
        <div className="text-slate-400 mb-1 text-sm">
          {pct >= 90 ? 'Outstanding! 日本語上手！' : pct >= 70 ? 'Great job! Keep it up!' : pct >= 50 ? 'Good effort! Keep practicing!' : "Don't give up! Review and try again!"}
        </div>
        <div className="text-xs text-amber-600 font-semibold mb-6">Best streak: {bestStreak} 🔥</div>
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          <div>
            <div className="text-2xl font-extrabold text-green-600">{score.c}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-600">{score.w}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Wrong</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{total}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Total</div>
          </div>
        </div>

        {wrong.length > 0 && (
          <div className="text-left mb-6">
            <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
              ❌ Words to Review ({wrong.length})
            </div>
            {wrong.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 bg-red-50 text-sm">
                <span className="font-bold text-base">{item.w.kana || item.w.kanji}</span>
                <span className="text-slate-400">—</span>
                <span className="font-medium">{item.w.english}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onBack}
          className="px-6 py-3 rounded-lg text-sm font-bold cursor-pointer bg-slate-50 border-2 border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors">
          ⚙️ New Settings
        </button>
      </div>
    );
  }

  const { w, displayed, isCorrect, isJp2En } = pair;
  const pct = Math.round((idx / total) * 100);

  const answer = (userSaysTrue) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(userSaysTrue);
    const correct = userSaysTrue === isCorrect;
    if (correct) {
      const newStreak = streak + 1;
      setScore(prev => ({ ...prev, c: prev.c + 1 }));
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
    } else {
      setScore(prev => ({ ...prev, w: prev.w + 1 }));
      setStreak(0);
      setWrong(prev => [...prev, { w }]);
    }
  };

  const next = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= total) {
      onFinish();
      return;
    }
    setIdx(nextIdx);
    setAnswered(false);
    setSelectedAnswer(null);
    setPair(makePair(cards, nextIdx, pool, qtype));
  };

  const userWasRight = answered && (selectedAnswer === isCorrect);

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-1 bg-slate-200 rounded-full h-2.5 min-w-[80px]">
          <div className="h-2.5 rounded-full gradient-bar transition-all duration-400" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-400 whitespace-nowrap">{idx + 1} / {total}</span>
        <div className="flex gap-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">✓ {score.c}</span>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600">✗ {score.w}</span>
          {streak >= 3 && (
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600">{streak} 🔥</span>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-7 mb-4 shadow-md text-center">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          {isJp2En ? 'Does this Japanese word mean…?' : 'Is this the correct Japanese for…?'}
        </div>

        {/* Word */}
        <div className={`font-extrabold mb-3 ${isJp2En ? 'text-5xl' : 'text-3xl'}`}
          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
          {isJp2En ? (w.kana || w.kanji || '') : (w.english || '')}
        </div>

        <div className="text-slate-300 text-sm mb-1">↓</div>

        {/* Displayed meaning */}
        <div className={`font-bold rounded-xl px-6 py-4 inline-block mb-6 border-2 transition-colors ${
          answered
            ? isCorrect
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'bg-red-50 border-red-300 text-red-700 line-through'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        } ${isJp2En ? 'text-2xl' : 'text-4xl'}`}
          style={!isJp2En ? { fontFamily: 'Noto Sans JP, sans-serif' } : {}}>
          {displayed}
        </div>

        {/* True / False buttons */}
        {!answered ? (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => answer(true)}
              className="py-4 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 font-black text-lg hover:bg-green-100 hover:border-green-400 transition-all cursor-pointer active:scale-95">
              ✅ True
            </button>
            <button onClick={() => answer(false)}
              className="py-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 font-black text-lg hover:bg-red-100 hover:border-red-400 transition-all cursor-pointer active:scale-95">
              ❌ False
            </button>
          </div>
        ) : (
          <div>
            <div className={`p-4 rounded-xl mb-4 text-sm font-semibold ${userWasRight ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {userWasRight
                ? `✅ Correct!${streak >= 3 ? ` ${streak} in a row! 🔥` : ''}`
                : <>❌ Wrong! The correct meaning is: <strong>{isJp2En ? (w.english || '') : (w.kana || w.kanji || '')}</strong></>
              }
            </div>
            <button onClick={next}
              className="w-full py-3 gradient-btn text-white rounded-xl text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity border-none">
              {idx + 1 < total ? 'Next →' : 'See Results 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
