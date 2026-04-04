import { useState, useEffect, useCallback, useRef } from 'react';
import { shuffle, getDirectionLabel } from './testUtils';

const TIME_PER_Q = 7; // seconds

export default function SpeedRound({ pool, words: rawWords, qtype, category, onFinish, onBack }) {
  const [cards] = useState(() => shuffle(rawWords));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState({ c: 0, w: 0 });
  const [wrong, setWrong] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState([]);
  const [currentQtype, setCurrentQtype] = useState('jp2en');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [timedOut, setTimedOut] = useState(false);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  const total = cards.length;

  const generateQuestion = useCallback((wordsList, index) => {
    const w = wordsList[index];
    let qt = qtype;
    if (qt === 'mixed') qt = Math.random() > 0.5 ? 'jp2en' : 'en2jp';
    const isJp2En = qt === 'jp2en';
    const correct = isJp2En ? (w.english || '') : (w.kana || w.kanji || '');
    const wrongPool = shuffle(pool.filter(x => x !== w)).slice(0, 3);
    const wrongs = wrongPool.map(x => isJp2En ? (x.english || '') : (x.kana || x.kanji || ''));
    const opts = shuffle([correct, ...wrongs]);
    setCorrectAnswer(correct);
    setOptions(opts);
    setCurrentQtype(qt);
    setAnswered(false);
    setSelectedAnswer(null);
    setTimedOut(false);
    setTimeLeft(TIME_PER_Q);
  }, [pool, qtype]);

  // Start timer when question loads
  useEffect(() => {
    if (!started) return;
    if (answered || idx >= total) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Time's up
          setAnswered(true);
          setTimedOut(true);
          setScore(s => ({ ...s, w: s.w + 1 }));
          const w = cards[idx];
          setWrong(prev => [...prev, { word: w, given: '(timed out)', correct: correctAnswer }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [idx, started, answered]);

  if (!started) {
    setStarted(true);
    generateQuestion(cards, 0);
  }

  // Finished
  if (idx >= total) {
    const pct = Math.round((score.c / total) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '😊' : pct >= 50 ? '🙂' : '💪';
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-md">
        <div className="text-5xl mb-3">{emoji}</div>
        <div className="text-4xl font-extrabold mb-1">{pct}%</div>
        <div className="text-slate-400 mb-6 text-sm">
          {pct >= 90 ? 'Lightning fast! 日本語上手！' : pct >= 70 ? 'Great reflexes! Keep it up!' : pct >= 50 ? 'Good effort! Speed up your recall!' : "Practice makes perfect — try again!"}
        </div>
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          <div>
            <div className="text-2xl font-extrabold text-green-600">{score.c}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-600">{score.w}</div>
            <div className="text-[0.72rem] text-slate-400 font-semibold uppercase">Wrong / Timeout</div>
          </div>
        </div>

        {wrong.length > 0 && (
          <div className="text-left mb-6">
            <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
              ❌ Missed Words ({wrong.length})
            </div>
            {wrong.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1 bg-red-50 text-sm">
                <span className="font-bold text-base">{item.word.kana || item.word.kanji}</span>
                <span className="text-slate-400">—</span>
                <span className="font-medium">{item.word.english}</span>
                {item.given === '(timed out)' && <span className="ml-auto text-xs text-orange-500 font-semibold">⏱ timed out</span>}
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

  const w = cards[idx];
  if (!w) return null;
  const pct = Math.round((idx / total) * 100);
  const isJp2En = currentQtype !== 'en2jp';
  const isKanji = category === 'kanji';
  const showKanjiFont = isKanji && isJp2En;
  const { label: dirLabel, color: dirColor } = getDirectionLabel(category, currentQtype);
  const timerPct = (timeLeft / TIME_PER_Q) * 100;
  const timerColor = timeLeft > 4 ? 'bg-green-500' : timeLeft > 2 ? 'bg-amber-500' : 'bg-red-500';

  const checkAnswer = (ans) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setSelectedAnswer(ans);
    if (ans === correctAnswer) {
      setScore(prev => ({ ...prev, c: prev.c + 1 }));
    } else {
      setScore(prev => ({ ...prev, w: prev.w + 1 }));
      setWrong(prev => [...prev, { word: w, given: ans, correct: correctAnswer }]);
    }
  };

  const nextQuestion = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= total) {
      onFinish();
      return;
    }
    setIdx(nextIdx);
    generateQuestion(cards, nextIdx);
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex-1 bg-slate-200 rounded-full h-2.5 min-w-[80px]">
          <div className="h-2.5 rounded-full gradient-bar transition-all duration-400" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-400 whitespace-nowrap">{idx + 1} / {total}</span>
        <div className="flex gap-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">✓ {score.c}</span>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600">✗ {score.w}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>
      <div className={`text-center text-xs font-black mb-4 ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
        {timedOut ? '⏱ Time\'s up!' : `⏱ ${timeLeft}s`}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 shadow-md">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${dirColor}`}>
          {dirLabel}
        </div>

        <div
          className={`font-extrabold mb-5 ${showKanjiFont ? 'text-6xl' : isJp2En ? 'text-4xl' : 'text-2xl'}`}
          style={showKanjiFont ? { fontFamily: 'Noto Sans JP, sans-serif' } : {}}
        >
          {isJp2En ? (w.kana || w.kanji || '') : (w.english || '')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((opt, i) => {
            let btnClass = 'opt-btn';
            if (answered || timedOut) {
              if (opt === correctAnswer) btnClass += ' correct';
              else if (opt === selectedAnswer) btnClass += ' wrong';
            }
            return (
              <button
                key={i}
                className={btnClass}
                onClick={() => checkAnswer(opt)}
                disabled={answered || timedOut}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {(answered || timedOut) && (
        <div className={`p-4 rounded-lg mb-4 text-sm font-medium ${
          selectedAnswer === correctAnswer && !timedOut
            ? 'bg-green-50 text-green-600 border border-green-300'
            : 'bg-red-50 text-red-600 border border-red-300'
        }`}>
          {timedOut
            ? <>⏱ Time's up! The answer was: <strong>{correctAnswer}</strong></>
            : selectedAnswer === correctAnswer
              ? '✅ Correct! Fast thinking! ⚡'
              : <>❌ Wrong! The correct answer is: <strong>{correctAnswer}</strong></>
          }
        </div>
      )}

      {(answered || timedOut) && (
        <button onClick={nextQuestion}
          className="w-full py-3 bg-hbg text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-700 transition-colors border-none">
          {idx + 1 < total ? 'Next Question →' : 'See Results 🏆'}
        </button>
      )}
    </div>
  );
}
