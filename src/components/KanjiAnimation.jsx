import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

/**
 * KanjiAnimation – animated stroke-order component powered by hanzi-writer / KanjiVG.
 *
 * Props:
 *   kanji    {string}  – single kanji character (e.g. "日")
 *   quizMode {boolean} – when true the user draws the strokes themselves
 */
export default function KanjiAnimation({ kanji = '日', quizMode = false, size = 200 }) {
  const containerRef = useRef(null);
  const writerRef    = useRef(null);

  const [strokeCount,   setStrokeCount]   = useState(null);
  const [isLoaded,      setIsLoaded]      = useState(false);
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [quizDone,      setQuizDone]      = useState(false);
  const [mistakes,      setMistakes]      = useState(0);
  const [loadError,     setLoadError]     = useState(false);

  /* ------------------------------------------------------------------ */
  /* Initialise / reinitialise writer whenever kanji changes             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!containerRef.current) return;

    // Reset state
    containerRef.current.innerHTML = '';
    writerRef.current = null;
    setIsLoaded(false);
    setIsPlaying(false);
    setStrokeCount(null);
    setQuizDone(false);
    setMistakes(0);
    setLoadError(false);

    let cancelled = false;

    const writer = HanziWriter.create(containerRef.current, kanji, {
      width:                size,
      height:               size,
      padding:              Math.round(size * 0.06),
      showOutline:          true,
      strokeColor:          '#1F2937',
      outlineColor:         '#E5E7EB',
      drawingColor:         '#4F46E5',
      drawingWidth:         4,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes:  300,
      showCharacter:        !quizMode,
      /* Intercept the KanjiVG data so we can read the stroke count */
      charDataLoader(char, onLoad, onError) {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`)
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
          })
          .then(data => {
            if (cancelled) return;
            setStrokeCount(data.strokes?.length ?? null);
            setIsLoaded(true);
            writerRef.current = writer;
            if (quizMode) beginQuiz(writer);
            onLoad(data);
          })
          .catch(err => {
            if (cancelled) return;
            console.error('hanzi-writer data load error:', err);
            setLoadError(true);
            setIsLoaded(true);
            onError(err);
          });
      },
    });

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [kanji]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------------------------------------------ */
  /* Quiz helpers                                                         */
  /* ------------------------------------------------------------------ */
  function beginQuiz(writer) {
    const w = writer ?? writerRef.current;
    if (!w) return;
    setQuizDone(false);
    setMistakes(0);
    w.quiz({
      onMistake:  ()     => setMistakes(m => m + 1),
      onComplete: ()     => setQuizDone(true),
    });
  }

  /* ------------------------------------------------------------------ */
  /* Playback controls                                                    */
  /* ------------------------------------------------------------------ */
  function handlePlay() {
    const w = writerRef.current;
    if (!w) return;
    w.animateCharacter({ onComplete: () => setIsPlaying(false) });
    setIsPlaying(true);
  }

  function handlePause() {
    const w = writerRef.current;
    if (!w) return;
    w.pauseAnimation();
    setIsPlaying(false);
  }

  function handleReplay() {
    const w = writerRef.current;
    if (!w) return;
    // Cancel any running quiz or animation first
    try { w.cancelQuiz(); }    catch (_) {}
    w.animateCharacter({ onComplete: () => setIsPlaying(false) });
    setIsPlaying(true);
    setQuizDone(false);
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 flex flex-col items-center gap-4" style={{ width: 'fit-content' }}>

      {/* ── Stroke count ── */}
      <div className="flex items-center gap-2 h-5">
        {isLoaded && strokeCount !== null ? (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {strokeCount} stroke{strokeCount !== 1 ? 's' : ''}
          </span>
        ) : isLoaded && loadError ? (
          <span className="text-xs text-rose-400 font-medium">Character not found</span>
        ) : (
          <span className="text-xs text-slate-300">Loading…</span>
        )}
      </div>

      {/* ── Canvas ── */}
      <div className="relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50" style={{ width: size, height: size }}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        )}
        <div ref={containerRef} style={{ width: size, height: size }} />
      </div>

      {/* ── Quiz feedback ── */}
      {quizMode && quizDone && (
        <div className={`text-sm font-semibold px-3 py-1.5 rounded-lg ${mistakes === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {mistakes === 0 ? '✓ Perfect!' : `✓ Done — ${mistakes} mistake${mistakes !== 1 ? 's' : ''}`}
        </div>
      )}

      {/* ── Controls ── */}
      {!quizMode ? (
        /* Playback buttons */
        <div className="flex gap-2">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              disabled={!isLoaded || loadError}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pause
            </button>
          )}

          <button
            onClick={handleReplay}
            disabled={!isLoaded || loadError}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-600 text-sm font-semibold rounded-lg border border-indigo-200 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
            </svg>
            Replay
          </button>
        </div>
      ) : (
        /* Quiz button */
        <button
          onClick={() => beginQuiz()}
          disabled={!isLoaded || loadError}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
          </svg>
          Retry Quiz
        </button>
      )}

      {/* ── Attribution ── */}
      <p className="text-[0.6rem] text-slate-300 text-center leading-tight">
        Kanji data © KanjiVG (CC BY-SA 4.0)
      </p>
    </div>
  );
}
