import { useState } from 'react';
import { generateFlashcards, evaluateAnswer, loginUser, registerUser, createSession, getUserSessions, getSessionDetail, updateSession, deleteSession } from './services/api';
import Dropzone from './components/Dropzone';
import SidebarMenu from './components/SidebarMenu';
import './App.css';

function App() {
  const [phase, setPhase] = useState('login');

  // Autentificare
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Sesiuni
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionFlashcardCounts, setSessionFlashcardCounts] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Documente și Flashcards
  const [files, setFiles] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [currentCard, setCurrentCard] = useState(0);

  // Mod revizuire
  const [isFlipped, setIsFlipped] = useState(false);

  // Setări
  const [numarIntrebari, setNumarIntrebari] = useState(5);
  const [severitate, setSeveritate] = useState(2);

  // ─── AUTENTIFICARE ───
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginMode) {
        setLoadingMsg('Se verifică datele...');
        const data = await loginUser(email, password);
        setUser(data);
        setLoadingMsg('Se încarcă sesiunile...');
        await loadUserSessions(data.user_id);
        setPhase('session-select');
      } else {
        setLoadingMsg('Se creează contul...');
        await registerUser(email, password);
        alert("Cont creat cu succes! Acum te poți autentifica.");
        setIsLoginMode(true);
        setPassword('');
      }
    } catch (err) {
      alert(`Eroare: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  // ─── LOAD USER SESSIONS ───
  const loadUserSessions = async (userId) => {
    try {
      const data = await getUserSessions(userId);
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Eroare la încărcarea sesiunilor:', err);
    }
  };

  // ─── CREATE NEW SESSION ───
  const handleCreateSession = async (title) => {
    if (!user) return;
    try {
      setLoading(true);
      const newSession = await createSession(title, user.user_id);
      setSessions([...sessions, newSession]);
      setCurrentSession(newSession);
      setSidebarOpen(false);
      setPhase('upload');
    } catch (err) {
      alert(`Eroare: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── SELECT SESSION ───
  const handleSelectSession = async (session) => {
    setSidebarOpen(false);
    try {
      setLoading(true);
      const sessionDetail = await getSessionDetail(session.id);
      setCurrentSession(session);
      if (sessionDetail.flashcards && sessionDetail.flashcards.length > 0) {
        const flashcardsFormatted = sessionDetail.flashcards.map(fc => ({
          id: fc.id,
          intrebare: fc.question,
          raspuns: fc.correct_answer
        }));
        setFlashcards(flashcardsFormatted);
        setSessionFlashcardCounts(prev => ({ ...prev, [session.id]: flashcardsFormatted.length }));
        setAnswers({});
        setCurrentCard(0);
        setIsFlipped(false);
        setPhase('review');
      } else {
        setPhase('upload');
      }
    } catch (err) {
      alert(`Eroare: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── RENAME SESSION ───
  const handleRenameSession = async (session) => {
    const nouTitlu = window.prompt('Noul nume al sesiunii:', session.title);
    if (nouTitlu === null) return;
    const titluCurat = nouTitlu.trim();
    if (!titluCurat || titluCurat === session.title) return;
    try {
      setLoading(true);
      await updateSession(session.id, titluCurat);
      setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, title: titluCurat } : s)));
      if (currentSession?.id === session.id) {
        setCurrentSession((prev) => ({ ...prev, title: titluCurat }));
      }
    } catch (err) {
      alert(`Eroare la redenumire: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── DELETE SESSION ───
  const handleDeleteSession = async (session) => {
    const ok = window.confirm(`Sigur vrei să ștergi sesiunea „${session.title}"? Această acțiune nu poate fi anulată.`);
    if (!ok) return;
    try {
      setLoading(true);
      await deleteSession(session.id);
      setSessions((prev) => prev.filter((s) => s.id !== session.id));
      setSessionFlashcardCounts(prev => { const n = { ...prev }; delete n[session.id]; return n; });
      if (currentSession?.id === session.id) {
        setCurrentSession(null);
        setFlashcards([]);
        setAnswers({});
        setResults([]);
        setPhase('session-select');
      }
    } catch (err) {
      alert(`Eroare la ștergere: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── LOGOUT ───
  const handleLogout = () => {
    setUser(null);
    setPhase('login');
    setEmail('');
    setPassword('');
    setSessions([]);
    setCurrentSession(null);
    setFlashcards([]);
    setAnswers({});
    setResults([]);
    setFiles([]);
    setSessionFlashcardCounts({});
  };

  // ─── GENERARE FLASHCARDS ───
  const handleGenerate = async () => {
    if (files.length === 0 || !currentSession || !user) return;
    setLoading(true);
    setLoadingMsg('AI-ul citește PDF-urile...');
    try {
      const data = await generateFlashcards(files, numarIntrebari, currentSession.id, user.user_id);
      const cards = data.flashcards || [];
      if (cards.length === 0) {
        alert('Nu s-au putut genera flashcards.');
        return;
      }
      setFlashcards(cards);
      setSessionFlashcardCounts(prev => ({ ...prev, [currentSession.id]: cards.length }));
      setAnswers({});
      setCurrentCard(0);
      setIsFlipped(false);
      setPhase('study');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      if (msg && msg.toLowerCase().includes('ollama')) {
        alert(
          'Ollama nu este pornit!\n\n' +
          'Pornește Ollama cu comanda:\n' +
          '  ollama serve\n\n' +
          'Și asigură-te că modelul llama3 este descărcat:\n' +
          '  ollama pull llama3'
        );
      } else {
        alert(`Eroare: ${msg}`);
      }
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAnswerChange = (index, value) => setAnswers((prev) => ({ ...prev, [index]: value }));
  const goNext = () => { if (currentCard < flashcards.length - 1) setCurrentCard((c) => c + 1); };
  const goPrev = () => { if (currentCard > 0) setCurrentCard((c) => c - 1); };

  // ─── EVALUARE ───
  const handleSubmitAll = async () => {
    const unanswered = flashcards.filter((_, i) => !answers[i]?.trim());
    if (unanswered.length > 0) {
      const ok = window.confirm(`Ai ${unanswered.length} card(uri) fără răspuns. Trimiți oricum?`);
      if (!ok) return;
    }

    setLoading(true);
    setLoadingMsg('AI-ul evaluează răspunsurile...');

    try {
      const evalPromises = flashcards.map((card, i) => {
        const raspusDat = answers[i]?.trim() || '';
        if (!raspusDat) return Promise.resolve({ scor: 0, status: 'INCORECT' });
        return evaluateAnswer(card.raspuns, raspusDat, severitate);
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

  const scorMediu = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.scor, 0) / results.length) : 0;
  const numarCorecte = results.filter((r) => r.status === 'CORECT').length;

  const handleRestart = () => {
    setPhase('upload');
    setFiles([]);
    setFlashcards([]);
    setAnswers({});
    setResults([]);
    setCurrentCard(0);
    setIsFlipped(false);
  };

  const handleStartReview = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setPhase('review');
  };

  const handleStartStudy = () => {
    setCurrentCard(0);
    setAnswers({});
    setIsFlipped(false);
    setPhase('study');
  };

  return (
    <div className="app-container">
      {user && phase !== 'login' && (
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Deschide/închide meniul"
        >
          ☰
        </button>
      )}

      {user && phase !== 'login' && (
        <SidebarMenu
          user={user}
          sessions={sessions}
          currentSession={currentSession}
          sessionFlashcardCounts={sessionFlashcardCounts}
          onSessionSelect={handleSelectSession}
          onCreateSession={handleCreateSession}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          onLogout={handleLogout}
          loading={loading}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <header className="app-header">
        <h1 className="logo">Neuro<span>Deck</span> <span className="brain">🧠</span></h1>
        {user ? <p className="tagline">Salutare, {user.email}!</p> : <p className="tagline">Învață mai smart cu AI</p>}
      </header>

      {/* ─── LOGIN ─── */}
      {phase === 'login' && (
        <section className="phase-login">
          <form className="auth-form" onSubmit={handleAuth}>
            <h2>{isLoginMode ? "Autentificare" : "Creează Cont"}</h2>
            <p className="auth-subtitle">
              {isLoginMode ? "Conectează-te pentru a-ți salva progresul" : "Introdu datele pentru a crea un cont nou"}
            </p>

            <input
              type="email" placeholder="Email" required className="auth-input"
              value={email} onChange={e => setEmail(e.target.value)} disabled={loading}
            />
            <input
              type="password" placeholder="Parolă" required className="auth-input"
              value={password} onChange={e => setPassword(e.target.value)} disabled={loading}
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? <span className="btn-loading"><span className="spinner" /> {loadingMsg || 'Se conectează...'}</span>
                : (isLoginMode ? "Intră în cont" : "Înregistrează-mă")
              }
            </button>

            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              disabled={loading}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '10px' }}
            >
              {isLoginMode ? "Nu ai cont? Creează unul" : "Ai deja cont? Autentifică-te"}
            </button>
          </form>
        </section>
      )}

      {/* ─── SESSION SELECT ─── */}
      {phase === 'session-select' && (
        <section className="phase-upload">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Bine ai venit! 👋</h2>
            <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>
              Selectează o sesiune existentă din stânga sau creează una nouă pentru a începe să studiezi.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ✨ Sugestie: Creează sesiuni pentru fiecare materie pe care vrei să o studiezi
            </p>
          </div>
        </section>
      )}

      {/* ─── UPLOAD ─── */}
      {phase === 'upload' && currentSession && (
        <section className="phase-upload">
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
            📚 Sesiune: <span style={{ color: 'var(--accent)' }}>{currentSession.title}</span>
          </h2>

          {/* Buton revizuire dacă sesiunea are flashcarduri deja */}
          {sessionFlashcardCounts[currentSession.id] > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button className="btn-secondary" onClick={handleStartReview}>
                👁 Revizuiește {sessionFlashcardCounts[currentSession.id]} flashcarduri existente
              </button>
            </div>
          )}

          <Dropzone onFilesSelect={setFiles} files={files} />

          <div className="settings-panel">
            <div className="setting-group">
              <label>Număr întrebări generate:</label>
              <input
                type="number" min="1" max="50"
                className="auth-input"
                style={{ width: "120px", padding: "10px" }}
                value={numarIntrebari}
                onChange={(e) => setNumarIntrebari(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="setting-group">
              <label>Severitate evaluare AI:</label>
              <select value={severitate} onChange={(e) => setSeveritate(parseInt(e.target.value))}>
                <option value={1}>🟢 Blând (Ușor de trecut)</option>
                <option value={2}>🟡 Normal (Echilibrat)</option>
                <option value={3}>🔴 Sever (Doar detalii precise)</option>
              </select>
            </div>
          </div>

          {files.length > 0 && (
            <div className="file-selected">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {files.map((f, idx) => (
                  <span key={idx} className="file-name" style={{ display: 'flex', alignItems: 'center' }}>
                    📎 {f.name}
                    <span
                      style={{ cursor: 'pointer', marginLeft: '10px', color: 'var(--red)', fontWeight: 'bold' }}
                      onClick={() => removeFile(idx)}
                    >✕</span>
                  </span>
                ))}
              </div>
              <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ marginTop: '10px' }}>
                {loading
                  ? <span className="btn-loading"><span className="spinner" /> {loadingMsg}</span>
                  : '⚡ Generează Flashcards din PDF-uri'
                }
              </button>
            </div>
          )}
        </section>
      )}

      {/* ─── REVIEW (MOD REVIZUIRE) ─── */}
      {phase === 'review' && currentSession && (
        <section className="phase-study">
          <div className="study-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="progress-label">Card {currentCard + 1} din {flashcards.length}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontFamily: 'Syne, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Mod Revizuire
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }} />
            </div>
          </div>

          <div
            className={`flip-card ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(f => !f)}
            title="Click pentru a întoarce cardul"
          >
            <div className="flip-card-inner">
              <div className="flip-card-front flashcard">
                <span className="card-label">Întrebare</span>
                <p style={{ fontSize: '1.15rem', fontWeight: 500, lineHeight: 1.5 }}>
                  {flashcards[currentCard].intrebare}
                </p>
                <p className="hint" style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '16px' }}>
                  Click pentru a vedea răspunsul
                </p>
              </div>
              <div className="flip-card-back flashcard">
                <span className="card-label" style={{ color: 'var(--green)' }}>Răspuns</span>
                <p style={{ fontSize: '1.15rem', fontWeight: 500, lineHeight: 1.5 }}>
                  {flashcards[currentCard].raspuns}
                </p>
                <p className="hint" style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '16px' }}>
                  Click pentru a vedea întrebarea
                </p>
              </div>
            </div>
          </div>

          <div className="nav-buttons">
            <button className="btn-secondary" onClick={() => { goPrev(); setIsFlipped(false); }} disabled={currentCard === 0}>
              ← Anterior
            </button>
            <button className="btn-primary" onClick={handleStartStudy}>
              ✏️ Începe testul
            </button>
            {currentCard < flashcards.length - 1
              ? <button className="btn-primary" onClick={() => { goNext(); setIsFlipped(false); }}>Următor →</button>
              : <button className="btn-secondary" onClick={() => { setCurrentCard(0); setIsFlipped(false); }}>↩ Reincepe</button>
            }
          </div>

          <div className="cards-dots">
            {flashcards.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === currentCard ? 'active' : ''}`}
                onClick={() => { setCurrentCard(i); setIsFlipped(false); }}
                title={`Card ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── STUDY ─── */}
      {phase === 'study' && currentSession && (
        <section className="phase-study">
          <div className="study-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="progress-label">Card {currentCard + 1} din {flashcards.length}</span>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={handleStartReview}
              >
                👁 Revizuiește
              </button>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }} />
            </div>
          </div>

          <div className="flashcard">
            <div className="card-question">
              <span className="card-label">Întrebare</span>
              <p>{flashcards[currentCard].intrebare}</p>
            </div>

            <div className="card-answer-area">
              <label className="card-label" htmlFor={`ans-${currentCard}`}>Răspunsul tău</label>
              <textarea
                id={`ans-${currentCard}`}
                className="answer-input"
                rows={4}
                placeholder="Scrie răspunsul aici..."
                value={answers[currentCard] || ''}
                onChange={(e) => handleAnswerChange(currentCard, e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) goNext(); }}
              />
              <p className="hint">Ctrl+Enter pentru card următor</p>
            </div>
          </div>

          <div className="nav-buttons">
            <button className="btn-secondary" onClick={goPrev} disabled={currentCard === 0}>← Anterior</button>

            {currentCard < flashcards.length - 1 ? (
              <button className="btn-primary" onClick={goNext}>Următor →</button>
            ) : (
              <button className="btn-submit" onClick={handleSubmitAll} disabled={loading}>
                {loading ? <span className="btn-loading"><span className="spinner" /> {loadingMsg}</span> : '✅ Trimite și evaluează'}
              </button>
            )}
          </div>

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

      {/* ─── RESULTS ─── */}
      {phase === 'results' && (
        <section className="phase-results">
          <div className="score-hero">
            <div className={`score-circle ${scorMediu >= 70 ? 'score-good' : scorMediu >= 40 ? 'score-medium' : 'score-bad'}`}>
              <span className="score-number">{scorMediu}</span>
              <span className="score-label">/ 100</span>
            </div>
            <h2>{scorMediu >= 70 ? '🎉 Felicitări!' : scorMediu >= 40 ? '📚 Mai exersează!' : '💪 Nu te descuraja!'}</h2>
            <p className="score-summary">Ai răspuns corect la <strong>{numarCorecte}</strong> din <strong>{results.length}</strong> întrebări.</p>
          </div>

          <div className="results-list">
            {results.map((r, i) => (
              <div key={i} className={`result-card ${r.status === 'CORECT' ? 'result-correct' : 'result-wrong'}`}>
                <div className="result-header">
                  <span className="result-index">#{i + 1}</span>
                  <span className={`result-badge ${r.status === 'CORECT' ? 'badge-correct' : 'badge-wrong'}`}>
                    {r.status === 'CORECT' ? '✓ Corect' : '✗ Incorect'} — {r.scor}%
                  </span>
                </div>
                <p className="result-question"><strong>Întrebare:</strong> {r.card.intrebare}</p>
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

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
            <button className="btn-secondary" onClick={handleStartReview}>
              👁 Revizuiește flashcardurile
            </button>
            <button className="btn-primary btn-restart" style={{ margin: 0 }} onClick={handleRestart}>
              🔄 Revino la upload
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
