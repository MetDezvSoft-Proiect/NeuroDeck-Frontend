import { useState } from 'react';

function SidebarMenu({ user, sessions, currentSession, onSessionSelect, onCreateSession, onRenameSession, onDeleteSession, onLogout, loading, isOpen = false, onClose }) {
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;
    
    await onCreateSession(newSessionTitle);
    setNewSessionTitle('');
    setShowNewSessionForm(false);
  };

  return (
    <>
      {/* Overlay pentru mobil (inchide meniul la click in afara) */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">📚 Sesiuni</h2>
      </div>

      {/* Current User Info */}
      {user && (
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <p className="user-name">Salutare!</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="sessions-container">
        <h3 className="sessions-label">Sesiunile tale</h3>
        
        {sessions && sessions.length > 0 ? (
          <div className="sessions-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`session-item ${currentSession?.id === session.id ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="session-main"
                  onClick={() => onSessionSelect(session)}
                  title={session.title}
                >
                  <span className="session-icon">📖</span>
                  <span className="session-name">{session.title}</span>
                </button>
                <div className="session-actions">
                  <button
                    type="button"
                    className="session-action-btn"
                    onClick={() => onRenameSession?.(session)}
                    disabled={loading}
                    title="Redenumește sesiunea"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="session-action-btn session-action-delete"
                    onClick={() => onDeleteSession?.(session)}
                    disabled={loading}
                    title="Șterge sesiunea"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-sessions">Nu ai sesiuni. Creează una!</p>
        )}

        {/* Create Session Form */}
        {!showNewSessionForm ? (
          <button
            className="btn-new-session"
            onClick={() => setShowNewSessionForm(true)}
            disabled={loading}
          >
            ✨ + Sesiune nouă
          </button>
        ) : (
          <form className="new-session-form" onSubmit={handleCreateSession}>
            <input
              type="text"
              placeholder="Denumire sesiune..."
              className="session-input"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              maxLength="30"
              autoFocus
            />
            <div className="form-actions">
              <button type="submit" className="btn-confirm">✓</button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowNewSessionForm(false);
                  setNewSessionTitle('');
                }}
              >
                ✕
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logout Button */}
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={onLogout}>
          🚪 Deconectare
        </button>
      </div>
    </aside>
    </>
  );
}

export default SidebarMenu;
