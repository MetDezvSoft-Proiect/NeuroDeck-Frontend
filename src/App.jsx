import { useState, useEffect } from 'react';
import { generateFlashcards, evaluateAnswer, loginUser, registerUser, createSession, getUserSessions, getSessionDetail } from './services/api';
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

  // Documente și Flashcards
  const [files, setFiles] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [currentCard, setCurrentCard] = useState(0);

  // Setări
  const [numarIntrebari, setNumarIntrebari] = useState(5);
  const [severitate, setSeveritate] = useState(2);

  // ─── AUTENTIFICARE ───
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        const data = await loginUser(email, password);
        setUser(data);
        // Încarcă sesiunile utilizatorului
        await loadUserSessions(data.user_id);
        setPhase('session-select');
      } else {
        await registerUser(email, password);
        alert("Cont creat cu succes! Acum te poți autentifica.");
        setIsLoginMode(true);
        setPassword('');
      }
    } catch (err) {
      alert(`Eroare: ${err.response?.data?.detail || err.message}`);
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
      setPhase('upload');
    } catch (err) {
      alert(`Eroare: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── SELECT SESSION ───
  const handleSelectSession = async (session) => {
    try {
      setLoading(true);
      const sessionDetail = await getSessionDetail(session.id);
      setCurrentSession(session);
      // Dacă sesiunea are flashcards salvate, le putem încărca direct
      if (sessionDetail.flashcards && sessionDetail.flashcards.length > 0) {
        const flashcardsFormatted = sessionDetail.flashcards.map(fc => ({
          id: fc.id,
          intrebare: fc.question,
          raspuns: fc.correct_answer
        }));
        setFlashcards(flashcardsFormatted);
        setAnswers({});
        setCurrentCard(0);
        setPhase('study');
      } else {
        setPhase('upload');
      }
    } catch (err) {
      alert(`Eroare: ${err.response?.data?.detail || err.message}`);
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
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      {user && phase !== 'login' && (
        <SidebarMenu
          user={user}
          sessions={sessions}
          currentSession={currentSession}
          onSessionSelect={handleSelectSession}
          onCreateSession={handleCreateSession}
          onLogout={handleLogout}
          loading={loading}
        />
      )}

      <header className="app-header">
        <h1 className="logo">Neuro<span>Deck</span> <span className="brain">🧠</span></h1>
        {user ? <p className="tagline">Salutare, {user.email}!</p> : <p className="tagline">Învață mai smart cu AI</p>}
      </header>

      {phase === 'login' && (
        <section className="phase-login">
          <form className="auth-form" onSubmit={handleAuth}>
            <h2>{isLoginMode ? "Autentificare" : "Creează Cont"}</h2>
            <p className="auth-subtitle">
              {isLoginMode ? "Conectează-te pentru a-ți salva progresul" : "Introdu datele pentru a crea un cont nou"}
            </p>
            
            <input 
              type="email" placeholder="Email" required className="auth-input" 
              value={email} onChange={e => setEmail(e.target.value)}
            />
            <input 
              type="password" placeholder="Parolă" required className="auth-input" 
              value={password} onChange={e => setPassword(e.target.value)}
            />
            
            <button type="submit" className="btn-primary">
              {isLoginMode ? "Intră în cont" : "Înregistrează-mă"}
            </button>

            <button 
              type="button" 
              onClick={() => setIsLoginMode(!isLoginMode)} 
              style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '10px'}}
            >
              {isLoginMode ? "Nu ai cont? Creează unul" : "Ai deja cont? Autentifică-te"}
            </button>
          </form>
        </section>
      )}

      {phase === 'session-select' && (
        <section className="phase-upload">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Bine ai venit! 👋</h2>
            <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>
              Selectează o sesiune existentă din stânga sau creează una nouă pentru a începe să studiezi.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ✨ Sugestie: Creează sesiuni pentru fiecare materie pe care vrei să o studiezi
              </p>
            </div>
          </div>
        </section>
      )}

      {phase === 'upload' && currentSession && (
        <section className="phase-upload">
          <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
            📚 Sesiune: <span style={{ color: 'var(--accent)' }}>{currentSession.title}</span>
          </h2>

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
                      <span key={idx} className="file-name" style={{display: 'flex', alignItems: 'center'}}>
                          📎 {f.name} 
                          <span 
                              style={{cursor: 'pointer', marginLeft: '10px', color: 'var(--red)', fontWeight: 'bold'}} 
                              onClick={() => removeFile(idx)}
                          >✕</span>
                      </span>
                  ))}
              </div>
              <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{marginTop: '10px'}}>
                {loading ? (
                  <span className="btn-loading"><span className="spinner" /> {loadingMsg}</span>
                ) : ('⚡ Generează Flashcards din PDF-uri')}
              </button>
            </div>
          )}
        </section>
      )}

      {phase === 'study' && currentSession && (
        <section className="phase-study">
          <div className="study-header">
            <span className="progress-label">
              Card {currentCard + 1} din {flashcards.length}
            </span>
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

          <button className="btn-primary btn-restart" onClick={handleRestart}>🔄 Revino la upload</button>
        </section>
      )}
    </div>
  );
}

export default App;