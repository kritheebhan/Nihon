import { useState, useCallback } from 'react';
import { shuffle } from './testUtils';

export default function MultipleChoice({ pool, words, qtype, onFinish, onBack }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState({ c: 0, w: 0 });
  const [wrong, setWrong] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState([]);
  const [currentQtype, setCurrentQtype] = useState('jp2en');
  const [showRomaji, setShowRomaji] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [started, setStarted] = useState(false);

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
    setHintUsed(false);
    setHintVisible(false);
  }, [pool, qtype]);

  // Initialize first question
  if (!started) {
    setStarted(true);
    generateQuestion(words, 0);
  }

  const checkAnswer = (ans) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(ans);
    if (ans === correctAnswer) {
      setScore(prev => ({ ...prev, c: prev.c + 1 }));
    } else {
      setScore(prev => ({ ...prev, w: prev.w + 1 }));
      setWrong(prev => [...prev, { word: words[idx], given: ans, correct: correctAnswer }]);
    }
  };

  const nextQuestion = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= words.length) {
      onFinish({ score: { c: score.c + (selectedAnswer === correctAnswer ? 0 : 0), w: score.w }, wrong, total: words.length,
        finalScore: { c: score.c, w: score.w }
      });
      return;
    }
    setIdx(nextIdx);
    generateQuestion(words, nextIdx);
  };

  const w = words[idx];
  if (!w) return null;
  const pct = Math.round((idx / words.length) * 100);
  const isJp2En = currentQtype === 'jp2en';

  let hintText = '';
  if (isJp2En) {
    if (w.kanji && w.kanji !== w.kana) hintText = `Kanji: ${w.kanji}`;
    else hintText = `Starts with: "${(w.english || '').slice(0, 2)}..."`;
  } else {
    const kana = w.kana || w.kanji || '';
    hintText = `Starts with: 「${kana.slice(0, 1)}...」`;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-1 bg-slate-200 rounded-full h-2.5 min-w-[80px]">
          <div className="h-2.5 rounded-full gradient-bar transition-all duration-400" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-400 whitespace-nowrap">{idx + 1} / {words.length}</span>
        <div className="flex gap-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">✓ {score.c}</span>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600">✗ {score.w}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 shadow-md">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isJp2En ? 'bg-n5-light text-n5' : 'bg-n4-light text-n4'}`}>
            {isJp2En ? 'Japanese → English' : 'English → Japanese'}
          </div>
          <button
            onClick={() => setShowRomaji(prev => !prev)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${showRomaji ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'}`}
          >
            {showRomaji ? '👁 Romaji ON' : '👁‍🗨 Romaji OFF'}
          </button>
        </div>

        <div className="text-3xl font-extrabold mb-1.5">
          {isJp2En ? (w.kana || w.kanji || '') : (w.english || '')}
        </div>
        {showRomaji && <div className="text-sm text-slate-400 mb-2 italic">Romaji: {w.romaji || '?'}</div>}

        <div className="mb-5">
          {!hintVisible && !answered && (
            <button onClick={() => { setHintVisible(true); setHintUsed(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors">
              💡 Show Hint
            </button>
          )}
          {hintVisible && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              💡 {hintText}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((opt, i) => {
            let btnClass = 'opt-btn';
            if (answered) {
              if (opt === correctAnswer) btnClass += ' correct';
              else if (opt === selectedAnswer) btnClass += ' wrong';
            }
            return (
              <button key={i} className={btnClass} onClick={() => checkAnswer(opt)} disabled={answered}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className={`p-4 rounded-lg mb-4 text-sm font-medium ${selectedAnswer === correctAnswer ? 'bg-green-50 text-green-600 border border-green-300' : 'bg-red-50 text-red-600 border border-red-300'}`}>
          {selectedAnswer === correctAnswer
            ? `✅ Correct! Well done! 🌟${hintUsed ? ' (hint used)' : ''}`
            : <>❌ Wrong! The correct answer is: <strong>{correctAnswer}</strong>{hintUsed ? ' (hint used)' : ''}</>
          }
        </div>
      )}

      {answered && (
        <button onClick={nextQuestion}
          className="w-full py-3 bg-hbg text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-700 transition-colors border-none">
          {idx + 1 < words.length ? 'Next Question →' : 'See Results 🏆'}
        </button>
      )}
    </div>
  );
}
