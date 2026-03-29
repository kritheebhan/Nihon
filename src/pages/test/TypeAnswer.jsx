import { useState, useRef } from 'react';
import { shuffle } from './testUtils';

export default function TypeAnswer({ pool, words: rawWords, qtype, onFinish, onBack }) {
  const [cards] = useState(() => shuffle(rawWords));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ c: 0, w: 0 });
  const [wrong, setWrong] = useState([]);
  const [showRomaji, setShowRomaji] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const inputRef = useRef(null);

  const total = cards.length;

  // Finished
  if (idx >= total) {
    const pct = Math.round((score.c / total) * 100);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '😊' : pct >= 50 ? '🙂' : '💪';
    const msg = pct >= 90 ? 'Excellent! 日本語上手！'
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
        </div>

        {wrong.length > 0 && (
          <div className="text-left mb-6">
            <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
              ❌ Words to Review ({wrong.length})
            </div>
            {wrong.map((item, i) => (
              <div key={i} className="grid grid-cols-[24px_1fr_1fr] gap-2 px-3 py-2 rounded-lg mb-1 bg-red-50 text-sm items-start">
                <span>❌</span>
                <span className="font-bold">{item.word.kana || item.word.kanji} — {item.word.english}</span>
                <span className="text-slate-400">You typed: "{item.given}"</span>
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
  const question = isJp2En ? (w.kana || w.kanji || '') : (w.english || '');
  const correctAnswer = isJp2En ? (w.english || '') : (w.kana || w.kanji || '');
  const pct = Math.round((idx / total) * 100);

  const normalize = (str) => str.toLowerCase().trim().replace(/[\/\(\)]/g, '').replace(/\s+/g, ' ');

  const checkAnswer = () => {
    if (answered) return;
    setAnswered(true);
    const userAns = normalize(input);
    const correct = normalize(correctAnswer);
    // Check if answer matches or is contained in alternatives (split by /)
    const alternatives = correctAnswer.split('/').map(s => normalize(s.trim()));
    const isRight = alternatives.some(alt => alt === userAns || alt.includes(userAns) && userAns.length >= 3);
    setIsCorrect(isRight);
    if (isRight) {
      setScore(prev => ({ ...prev, c: prev.c + 1 }));
    } else {
      setScore(prev => ({ ...prev, w: prev.w + 1 }));
      setWrong(prev => [...prev, { word: w, given: input, correct: correctAnswer }]);
    }
  };

  const nextQuestion = () => {
    setIdx(idx + 1);
    setInput('');
    setAnswered(false);
    setIsCorrect(false);
    setHintVisible(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!answered) checkAnswer();
      else nextQuestion();
    }
  };

  // Hint: first 2 characters of answer
  const hintText = isJp2En
    ? `Starts with: "${correctAnswer.slice(0, 2)}..."`
    : `Starts with: 「${correctAnswer.slice(0, 1)}...」`;

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
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 shadow-md">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isJp2En ? 'bg-n5-light text-n5' : 'bg-n4-light text-n4'}`}>
            {isJp2En ? 'Japanese → English' : 'English → Japanese'}
          </div>
          <button
            onClick={() => setShowRomaji(prev => !prev)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${showRomaji ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
          >
            {showRomaji ? '👁 Romaji ON' : '👁‍🗨 Romaji OFF'}
          </button>
        </div>

        <div className={`font-extrabold mb-1.5 ${isJp2En ? 'text-4xl' : 'text-2xl'}`}>
          {question}
        </div>
        {showRomaji && <div className="text-sm text-slate-400 mb-2 italic">Romaji: {w.romaji || '?'}</div>}

        {/* Hint */}
        <div className="mb-4">
          {!hintVisible && !answered && (
            <button onClick={() => setHintVisible(true)}
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

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isJp2En ? 'Type the English meaning...' : 'Type the Japanese reading...'}
            disabled={answered}
            autoFocus
            className={`flex-1 px-4 py-3 border-2 rounded-lg text-sm outline-none transition-colors ${
              answered
                ? isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                : 'border-slate-200 focus:border-n5'
            }`}
          />
          {!answered && (
            <button onClick={checkAnswer}
              className="px-5 py-3 gradient-btn text-white rounded-lg text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity border-none whitespace-nowrap">
              Check ↵
            </button>
          )}
        </div>
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`p-4 rounded-lg mb-4 text-sm font-medium ${isCorrect ? 'bg-green-50 text-green-600 border border-green-300' : 'bg-red-50 text-red-600 border border-red-300'}`}>
          {isCorrect
            ? '✅ Correct! Well done! 🌟'
            : <>❌ Wrong! The correct answer is: <strong>{correctAnswer}</strong></>
          }
        </div>
      )}

      {answered && (
        <button onClick={nextQuestion}
          className="w-full py-3 bg-hbg text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-700 transition-colors border-none">
          {idx + 1 < total ? 'Next Question →' : 'See Results 🏆'}
        </button>
      )}
    </div>
  );
}
