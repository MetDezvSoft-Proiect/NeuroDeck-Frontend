import { useState } from 'react';
import { generateFlashcards, evaluateAnswer } from './services/api';
import Dropzone from './components/Dropzone';
import './App.css';

// FAZELE aplicației
// 'upload'   → drag & drop + buton generare
// 'study'    → studentul tastează răspunsuri la fiecare card
// 'results'  → scor final + răspunsurile corecte

function App() {
  const [phase, setPhase] = useState('upload');
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [answers, setAnswers] = useState({}); // { index: "raspuns scris" }
  const [results, setResults] = useState([]);  // [{ card, raspuns_dat, scor, status }]
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [currentCard, setCurrentCard] = useState(0);

  // ─── PASUL 1: Generare flashcards ───
  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    setLoadingMsg('AI-ul citește PDF-ul...');
    try {
      const data = await generateFlashcards(file);
      const cards = data.flashcards || [];
      if (cards.length === 0) {
        alert('Nu s-au putut genera flashcards din acest PDF.');
        return;
      }
      setFlashcards(cards);
      setAnswers({});
      setCurrentCard(0);
      setPhase('study');
    } catch (err) {
      alert(`Eroare: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  // ─── PASUL 2: Navigare între carduri ───
  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const goNext = () => {
    if (currentCard < flashcards.length - 1) setCurrentCard((c) => c + 1);
  };

  const goPrev = () => {
    if (currentCard > 0) setCurrentCard((c) => c - 1);
  };

  // ─── PASUL 3: Trimitere pentru evaluare ───
  const handleSubmitAll = async () => {
    // Verifică dacă toate cardurile au un răspuns
    const unanswered = flashcards.filter((_, i) => !answers[i]?.trim());
    if (unanswered.length > 0) {
      const ok = window.confirm(
        `Ai ${unanswered.length} card(uri) fără răspuns. Trimiți oricum?`
      );
      if (!ok) return;
    }

    setLoading(true);
    setLoadingMsg('AI-ul evaluează răspunsurile...');

    try {
      const evalPromises = flashcards.map((card, i) => {
        const raspusDat = answers[i]?.trim() || '';
        if (!raspusDat) {
          return Promise.resolve({ scor: 0, status: 'INCORECT' });
        }
        return evaluateAnswer(card.raspuns, raspusDat);
      });

      const evalResults = await Promise.all(evalPromises);

      const combined = flashcards.map((card, i) => ({
        card,
        raspuns_dat: answers[i]?.trim() || '(fără răspuns)',
        scor: evalResults[i].scor,
        status: evalResults[i].status,
      }));

      setResults(combined);
      setPhase('results');
    } catch (err) {
      alert(`Eroare la evaluare: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  // ─── Calculare scor total ───
  const scorMediu =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.scor, 0) / results.length)
      : 0;

  const numarCorecte = results.filter((r) => r.status === 'CORECT').length;

  // ─── Restart ───
  const handleRestart = () => {
    setPhase('upload');
    setFile(null);
    setFlashcards([]);
    setAnswers({});
    setResults([]);
    setCurrentCard(0);
  };

  // ════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════
  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <h1 className="logo">Neuro<span>Deck</span> <span className="brain">🧠</span></h1>
        <p className="tagline">Învață mai smart cu AI</p>
      </header>

      {/* ── FAZA: UPLOAD ── */}
      {phase === 'upload' && (
        <section className="phase-upload">
          <Dropzone onFileSelect={setFile} hasFile={!!file} />

          {file && (
            <div className="file-selected">
              <span className="file-name">📎 {file.name}</span>
              <button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" /> {loadingMsg}
                  </span>
                ) : (
                  '⚡ Generează Flashcards'
                )}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── FAZA: STUDY ── */}
      {phase === 'study' && (
        <section className="phase-study">
          <div className="study-header">
            <span className="progress-label">
              Card {currentCard + 1} din {flashcards.length}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Card curent */}
          <div className="flashcard">
            <div className="card-question">
              <span className="card-label">Întrebare</span>
              <p>{flashcards[currentCard].intrebare}</p>
            </div>

            <div className="card-answer-area">
              <label className="card-label" htmlFor={`ans-${currentCard}`}>
                Răspunsul tău
              </label>
              <textarea
                id={`ans-${currentCard}`}
                className="answer-input"
                rows={4}
                placeholder="Scrie răspunsul aici..."
                value={answers[currentCard] || ''}
                onChange={(e) => handleAnswerChange(currentCard, e.target.value)}
                onKeyDown={(e) => {
                  // Ctrl+Enter → card următor
                  if (e.key === 'Enter' && e.ctrlKey) goNext();
                }}
              />
              <p className="hint">Ctrl+Enter pentru card următor</p>
            </div>
          </div>

          {/* Navigare */}
          <div className="nav-buttons">
            <button className="btn-secondary" onClick={goPrev} disabled={currentCard === 0}>
              ← Anterior
            </button>

            {currentCard < flashcards.length - 1 ? (
              <button className="btn-primary" onClick={goNext}>
                Următor →
              </button>
            ) : (
              <button
                className="btn-submit"
                onClick={handleSubmitAll}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" /> {loadingMsg}
                  </span>
                ) : (
                  '✅ Trimite și evaluează'
                )}
              </button>
            )}
          </div>

          {/* Miniatură toate cardurile */}
          <div className="cards-dots">
            {flashcards.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentCard ? 'active' : ''} ${answers[i]?.trim() ? 'answered' : ''}`}
                onClick={() => setCurrentCard(i)}
                title={`Card ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── FAZA: RESULTS ── */}
      {phase === 'results' && (
        <section className="phase-results">
          {/* Scor mare */}
          <div className="score-hero">
            <div
              className={`score-circle ${
                scorMediu >= 70 ? 'score-good' : scorMediu >= 40 ? 'score-medium' : 'score-bad'
              }`}
            >
              <span className="score-number">{scorMediu}</span>
              <span className="score-label">/ 100</span>
            </div>
            <h2>
              {scorMediu >= 70
                ? '🎉 Felicitări!'
                : scorMediu >= 40
                ? '📚 Mai exersează!'
                : '💪 Nu te descuraja!'}
            </h2>
            <p className="score-summary">
              Ai răspuns corect la <strong>{numarCorecte}</strong> din{' '}
              <strong>{results.length}</strong> întrebări.
            </p>
          </div>

          {/* Lista detaliată */}
          <div className="results-list">
            {results.map((r, i) => (
              <div
                key={i}
                className={`result-card ${r.status === 'CORECT' ? 'result-correct' : 'result-wrong'}`}
              >
                <div className="result-header">
                  <span className="result-index">#{i + 1}</span>
                  <span className={`result-badge ${r.status === 'CORECT' ? 'badge-correct' : 'badge-wrong'}`}>
                    {r.status === 'CORECT' ? '✓ Corect' : '✗ Incorect'} — {r.scor}%
                  </span>
                </div>

                <p className="result-question">
                  <strong>Întrebare:</strong> {r.card.intrebare}
                </p>

                <div className="result-answers">
                  <div className="answer-box your-answer">
                    <span className="answer-box-label">Răspunsul tău</span>
                    <p>{r.raspuns_dat}</p>
                  </div>
                  <div className="answer-box correct-answer">
                    <span className="answer-box-label">Răspuns corect</span>
                    <p>{r.card.raspuns}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary btn-restart" onClick={handleRestart}>
            🔄 Încearcă cu alt PDF
          </button>
        </section>
      )}
    </div>
  );
}

export default App;
