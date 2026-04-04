import { useState, useCallback } from 'react';
import { shuffle, getDirectionLabel } from './testUtils';

export default function MultipleChoice({ pool, words, qtype, category, onFinish, onBack }) {
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
  const [done, setDone] = useState(false);

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
      setDone(true);
      return;
    }
    setIdx(nextIdx);
    generateQuestion(words, nextIdx);
  };

  // ── Results screen ──────────────────────────────────────
  if (done) {
    const total = words.length;
    const pct = Math.round((score.c / total) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '😊' : pct >= 50 ? '🙂' : '💪';
    const msg = pct >= 90 ? 'Outstanding! 日本語上手！'
      : pct >= 70 ? 'Great job! Keep it up!'
      : pct >= 50 ? 'Good effort! Keep practicing!'
      : "Don't give up! Review and try again!";
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-md">
        <div className="text-5xl mb-3">{emoji}</div>
        <div className="text-4xl font-extrabold mb-1">{pct}%</div>
        <div className="text-slate-400 mb-6 text-sm">{msg}</div>
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
                <span className="font-bold text-base">{item.word.kana || item.word.kanji}</span>
                <span className="text-slate-400">—</span>
                <span className="font-medium">{item.word.english}</span>
                <span className="text-slate-400 text-xs ml-auto">You chose: "{item.given}"</span>
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

  const w = words[idx];
  if (!w) return null;
  const pct = Math.round((idx / words.length) * 100);
  const isJp2En = currentQtype !== 'en2jp';
  const isKanji = category === 'kanji';
  const { label: dirLabel, color: dirColor } = getDirectionLabel(category, currentQtype);

  // For kanji: question is kana field (which holds kanji char or english depending on qtype)
  const questionText = isJp2En ? (w.kana || w.kanji || '') : (w.english || '');
  const showKanjiFont = isKanji && isJp2En && currentQtype !== 'en2jp';

  let hintText = '';
  if (isJp2En) {
    hintText = `Starts with: "${(w.english || '').slice(0, 2)}..."`;
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
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${dirColor}`}>
            {dirLabel}
          </div>
          {!isKanji && (
            <button
              onClick={() => setShowRomaji(prev => !prev)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${showRomaji ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'}`}
            >
              {showRomaji ? '👁 Romaji ON' : '👁‍🗨 Romaji OFF'}
            </button>
          )}
        </div>

        <div
          className={`font-extrabold mb-1.5 ${showKanjiFont ? 'text-6xl' : isJp2En ? 'text-3xl' : 'text-2xl'}`}
          style={showKanjiFont ? { fontFamily: 'Noto Sans JP, sans-serif' } : {}}
        >
          {questionText}
        </div>
        {!isKanji && showRomaji && <div className="text-sm text-slate-400 mb-2 italic">Romaji: {w.romaji || '?'}</div>}

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
