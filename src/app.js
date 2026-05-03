import { useState } from 'react';
// 1. Schimbăm numele importului pentru a se potrivi cu api.js (unde ai 'generateFlashcards')
import { generateFlashcards } from './services/api'; 
import Dropzone from './components/Dropzone';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleProcess = async () => {
        if (!file) return;
        setLoading(true);
        try {
            // 2. Folosim funcția corectă importată
            const data = await generateFlashcards(file); 
            
            // 3. Backend-ul tău returnează { "flashcards": [...] } 
            setFlashcards(data.flashcards || []); 
        } catch (error) {
            console.error("Eroare la procesare:", error);
            alert("Eroare la comunicarea cu backend-ul!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1>NeuroDeck AI 🧠</h1>
            
            <Dropzone onFileSelect={setFile} />

            {file && (
                <div className="file-info">
                    <p>Fișier selectat: {file.name}</p>
                    <button onClick={handleProcess} disabled={loading}>
                        {loading ? "AI-ul generează..." : "Generează Flashcards ⚡"}
                    </button>
                </div>
            )}

            <div className="flashcards-grid">
                {flashcards.map((card, index) => (
                    <div key={index} className="card-item">
                        {/* 4. ATENȚIE: În Python ai 'intrebare' și 'raspuns', nu 'question' */}
                        <p><strong>Q:</strong> {card.intrebare}</p>
                        <p><strong>A:</strong> {card.raspuns}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;