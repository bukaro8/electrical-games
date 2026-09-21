import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SYMBOLS, answerPoints, makeRound } from './data';
import { SymbolDrawing } from './SymbolDrawing';
import './symbols.css';

type Answer = { id: string; correct: boolean; points: number; revealed: boolean };
export function SymbolQuiz() {
  const [round, setRound] = useState(() => makeRound());
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [help, setHelp] = useState(false);
  const [hint, setHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const { question, options } = round[index];
  const answer = answers[index];
  const score = answers.reduce((sum, a) => sum + a.points, 0);
  const missed = round.filter((_, i) => answers[i] && !answers[i].correct).map(r => r.question);
  const correctCount = answers.filter(a => a.correct).length;

  useEffect(() => { heading.current?.focus(); }, [index, finished, round]);
  useEffect(() => { if (answer) next.current?.focus(); }, [answer]);

  function submit(id: string, revealed = false) {
    if (answer) return;
    const correct = id === question.id && !revealed;
    setAnswers(previous => previous.length > index ? previous : [...previous, {
      id, correct, points: answerPoints(correct, hint, revealed), revealed,
    }]);
  }
  function advance() {
    if (index === round.length - 1) setFinished(true);
    else { setIndex(index + 1); setHint(false); setHelp(false); }
  }
  function restart(review = false) {
    setRound(makeRound(review && missed.length ? missed : SYMBOLS));
    setIndex(0); setAnswers([]); setHint(false); setHelp(false); setFinished(false);
  }

  return (
    <div className="symbol-quiz min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 bg-white/95 border-b border-slate-200 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-blue-700">← All games</Link>
          <div className="flex items-center gap-5 sm:gap-8">
            <div className="text-right"><span className="block text-xs uppercase tracking-widest text-slate-500">Progress</span><strong>{finished ? round.length : index + 1} <span className="text-slate-400 font-normal">/ {round.length}</span></strong></div>
            <div className="bg-blue-50 rounded-xl px-4 py-2 text-right" aria-label={`Score ${score} out of ${round.length * 10}`}><span className="block text-xs uppercase tracking-widest text-blue-600">Score</span><strong className="text-2xl text-blue-800 tabular-nums">{score}<span className="text-sm font-normal text-blue-500"> / {round.length * 10}</span></strong></div>
          </div>
        </div>
        <div role="progressbar" aria-label="Questions completed" aria-valuenow={answers.length} aria-valuemin={0} aria-valuemax={round.length} className="h-1 bg-slate-100"><div className="h-full bg-blue-600 transition-all" style={{ width: `${answers.length / round.length * 100}%` }} /></div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {finished ? (
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
            <div className="text-4xl mb-4" aria-hidden="true">✦</div>
            <p className="text-blue-700 text-xs tracking-widest uppercase font-bold">Round complete</p>
            <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold mt-2">{correctCount === round.length ? 'You know your symbols!' : 'Good practice. Keep building your knowledge.'}</h1>
            <p className="text-slate-600 mt-4">{correctCount} of {round.length} identified correctly · {score} points</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {missed.length > 0 && <button className="quiz-primary" onClick={() => restart(true)}>Practise {missed.length} missed {missed.length === 1 ? 'symbol' : 'symbols'}</button>}
              <button className={missed.length ? 'quiz-secondary' : 'quiz-primary'} onClick={() => restart()}>Play again</button>
              <Link className="quiz-secondary" to="/">All games</Link>
            </div>
            {missed.length > 0 && <div className="mt-10 text-left"><h2 className="font-bold text-lg mb-4">Your review cards</h2><div className="grid sm:grid-cols-2 gap-4">{missed.map(s => <article key={s.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl"><div className="w-16 h-16 shrink-0"><SymbolDrawing symbol={s} named /></div><div><h3 className="font-semibold">{s.name}</h3><p className="text-sm text-slate-500 mt-1">{s.explanation}</p></div></article>)}</div></div>}
          </section>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 mb-7">
              <div><p className="text-xs uppercase tracking-widest font-bold text-blue-700 mb-2">Symbol match · Unit 203</p><h1 ref={heading} tabIndex={-1} className="text-3xl sm:text-4xl font-bold tracking-tight">What’s this symbol?</h1><p className="text-slate-500 mt-2">Choose its name. Take your time—there’s no timer.</p></div>
              <button className="quiz-secondary shrink-0" aria-expanded={help} aria-controls="quiz-help" onClick={() => setHelp(!help)}> ? Help</button>
            </div>
            {help && <aside id="quiz-help" className="rounded-2xl bg-blue-50 border border-blue-100 p-5 mb-6"><h2 className="font-semibold">A little help?</h2><p className="text-sm text-slate-600 mt-1">Correct answer: 10 points. With a hint: 5 points. A revealed or incorrect answer: 0 points.</p><div className="flex flex-wrap gap-3 mt-3"><button className="quiz-secondary" disabled={hint || !!answer} onClick={() => setHint(true)}>{hint ? 'Hint shown' : 'Give me a hint'}</button><button className="quiz-secondary" disabled={!!answer} onClick={() => submit(question.id, true)}>Reveal answer · 0 points</button></div></aside>}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="symbol-board bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-6 min-h-[260px] sm:min-h-[350px]"><span className="text-xs text-slate-400 uppercase tracking-widest mb-5">Identify the symbol</span><div className="w-40 h-40 sm:w-52 sm:h-52"><SymbolDrawing symbol={question} /></div><span className="text-xs text-slate-400 mt-5">Electrical installation symbols</span></div>
              <section aria-label="Choose a matching name" className="flex flex-col justify-center gap-3">
                {options.map((option, i) => {
                  const isCorrect = !!answer && option.id === question.id;
                  const isWrong = !!answer && answer.id === option.id && !answer.correct && !answer.revealed;
                  return <button key={option.id} disabled={!!answer} onClick={() => submit(option.id)} className={`quiz-choice ${isCorrect ? 'quiz-correct' : isWrong ? 'quiz-wrong' : ''}`}><span className="quiz-letter">{String.fromCharCode(65 + i)}</span><span className="flex-1">{option.name}</span>{isCorrect && <span className="text-sm">✓ Correct</span>}{isWrong && <span className="text-sm">✕</span>}</button>;
                })}
              </section>
            </div>
            <div aria-live="polite" aria-atomic="true">
              {hint && !answer && <p className="mt-5 p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200"><strong>Hint:</strong> {question.hint}</p>}
              {answer && <section className={`mt-6 p-5 sm:p-6 rounded-2xl border ${answer.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'}`}><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h2 className="text-lg font-bold">{answer.revealed ? 'Answer revealed' : answer.correct ? `That’s right! +${answer.points} points` : 'Not quite—here’s the answer'}</h2><p className="font-semibold mt-1">{question.name}</p><p className="text-sm text-slate-600 mt-2">{question.explanation}</p></div><button ref={next} className="quiz-primary shrink-0" onClick={advance}>{index === round.length - 1 ? 'See results' : 'Next symbol →'}</button></div></section>}
            </div>
            <p className="text-xs text-slate-400 text-center mt-7">10 points per match · Hints available · Use Tab and Enter to play with a keyboard</p>
          </>
        )}
      </main>
    </div>
  );
}
