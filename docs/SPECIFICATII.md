# 📑 Specificații software — NeuroDeck Frontend

> **Document:** Specificația Cerințelor Software (SRS — *Software Requirements Specification*)
> **Produs:** NeuroDeck — generator inteligent de flashcards din documente PDF
> **Componentă:** Frontend (interfața utilizator)
> **Versiune:** 1.0 (MVP)
> **Ultima actualizare:** 2026-06-15

---

## 1. Introducere

### 1.1 Scopul documentului
Acest document descrie cerințele componentei **frontend** a aplicației NeuroDeck: ecranele, fluxurile de utilizator, componentele și interacțiunea cu API-ul backend. Servește ca bază pentru [`BACKLOG.md`](BACKLOG.md) și [`SPRINTURI.md`](SPRINTURI.md).

### 1.2 Descrierea produsului
**NeuroDeck** transformă materiale de studiu (PDF-uri) în **flashcards** generate cu AI. Frontend-ul este o aplicație **React (Vite)** care oferă utilizatorului o interfață pentru autentificare, gestionarea sesiunilor de studiu, încărcarea documentelor și parcurgerea/răspunsul la flashcards.

### 1.3 Public țintă
- Studenți și elevi care învață pe bază de materiale proprii.
- Utilizatori care vor recapitulare rapidă, interactivă, pe telefon sau desktop.

---

## 2. Roluri și actori

| Actor | Descriere |
|---|---|
| **Vizitator** | Vede ecranul de autentificare; se poate înregistra sau loga. |
| **Utilizator autentificat** | Gestionează sesiuni, încarcă PDF-uri, parcurge flashcards, primește feedback. |
| **API Backend** | Sursa de date; frontend-ul comunică prin HTTP (axios). |

---

## 3. Ecrane și fluxuri

### 3.1 Harta ecranelor (faze)
Aplicația folosește un sistem de **faze** (`phase`) pentru navigare:

```text
[login] ──► [dashboard / sesiuni] ──► [upload PDF] ──► [studiu flashcards] ──► [rezultate]
   ▲                   │
   └───── logout ◄──────┘
```

| Fază | Ecran | Descriere |
|---|---|---|
| `login` | Autentificare | Formular login / înregistrare (comutabil). |
| `dashboard` | Sesiuni de studiu | Meniu lateral cu sesiunile utilizatorului. |
| `upload` | Încărcare documente | Zonă drag & drop pentru PDF-uri + setări (nr. întrebări, severitate). |
| `study` | Studiu | Parcurgerea flashcards-urilor una câte una, cu câmp de răspuns. |
| `results` | Rezultate | Scorurile și verdictele pentru răspunsuri. |

---

## 4. Cerințe funcționale

| ID | Cerință |
|---|---|
| **RF-01** | Utilizatorul poate comuta între modul de login și cel de înregistrare. |
| **RF-02** | Utilizatorul se poate înregistra cu email și parolă. |
| **RF-03** | Utilizatorul se poate autentifica, iar la succes sesiunile lui se încarcă. |
| **RF-04** | Utilizatorul vede lista sesiunilor în meniul lateral. |
| **RF-05** | Utilizatorul poate crea o sesiune nouă de studiu. |
| **RF-06** | Utilizatorul poate selecta o sesiune ca să-i vadă conținutul. |
| **RF-07** | Utilizatorul poate încărca unul sau mai multe PDF-uri prin drag & drop. |
| **RF-08** | Utilizatorul poate configura numărul de întrebări generate. |
| **RF-09** | Utilizatorul poate configura nivelul de severitate al evaluării. |
| **RF-10** | Utilizatorul vede flashcards-urile generate și le poate parcurge pe rând. |
| **RF-11** | Utilizatorul poate introduce un răspuns pentru fiecare flashcard. |
| **RF-12** | Utilizatorul vede scorul și verdictul (CORECT/INCORECT) după evaluare. |
| **RF-13** | Aplicația afișează mesaje de încărcare în timpul operațiilor lungi (AI). |
| **RF-14** | Aplicația afișează erori prietenoase (ex: Ollama oprit, PDF invalid). |

---

## 5. Cerințe non-funcționale

| ID | Categorie | Cerință |
|---|---|---|
| **RNF-01** | Utilizabilitate | Interfața este intuitivă, cu feedback vizual la fiecare acțiune. |
| **RNF-02** | Responsivitate | Layout-ul funcționează pe desktop și ecrane mai mici. |
| **RNF-03** | Performanță | Build optimizat cu Vite; încărcare rapidă a aplicației. |
| **RNF-04** | Mentenabilitate | Componente React separate (Dropzone, SidebarMenu) și un strat de servicii API. |
| **RNF-05** | Robustețe | Stările de încărcare și eroare sunt tratate explicit. |
| **RNF-06** | Configurabilitate | URL-ul API-ului este centralizat (`API_BASE_URL`) și ușor de schimbat. |

---

## 6. Arhitectură și stack tehnologic

| Zonă | Tehnologie |
|---|---|
| Framework UI | React 18 |
| Build tool | Vite 5 |
| HTTP client | axios |
| Upload fișiere | react-dropzone |
| Stilizare | CSS (`App.css`, `sidebar.css`) |

### 6.1 Structura componentelor
```text
src/
├── App.jsx              Componenta rădăcină + gestionarea fazelor și stării
├── main.jsx             Punctul de intrare React
├── components/
│   ├── Dropzone.jsx     Zona drag & drop pentru PDF-uri
│   └── SidebarMenu.jsx  Meniul lateral cu sesiunile de studiu
├── services/
│   └── api.js           Stratul de comunicare cu backend-ul (axios)
└── *.css                Stiluri
```

---

## 7. Integrarea cu backend-ul

Frontend-ul consumă API-ul NeuroDeck (vezi specificațiile backend-ului). Apeluri principale din `services/api.js`:

| Funcție frontend | Endpoint backend | Scop |
|---|---|---|
| `registerUser` | `POST /users/` | Înregistrare |
| `loginUser` | `POST /login` | Autentificare |
| `createSession` | `POST /sessions` | Creare sesiune |
| `getUserSessions` | `GET /sessions/{user_id}` | Listare sesiuni |
| `getSessionDetail` | `GET /sessions/detail/{session_id}` | Detalii sesiune |
| `generateFlashcards` | `POST /upload` | Upload PDF + generare |
| `evaluateAnswer` | `POST /evaluate` | Evaluare răspuns |

> ⚙️ Dacă backend-ul rulează pe alt host/port, se actualizează `API_BASE_URL` din `services/api.js`.

---

## 8. Constrângeri și presupuneri

- Backend-ul NeuroDeck trebuie să ruleze (implicit `http://localhost:8000`).
- Ollama trebuie pornit pentru ca generarea flashcards-urilor să funcționeze.
- Sunt acceptate doar fișiere `.pdf` la upload.

---

## 9. Documente conexe
- 📋 [Backlog de produs](BACKLOG.md)
- 🏃 [Planificare sprinturi](SPRINTURI.md)
- 📖 [README](../README)
