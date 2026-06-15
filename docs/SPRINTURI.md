# 🏃 Planificare sprinturi — NeuroDeck (Frontend)

> **Metodologie:** Scrum / dezvoltare iterativă
> **Durată sprint:** ~1 săptămână
> **Ultima actualizare:** 2026-06-15

Acest document mapează [backlog-ul frontend](BACKLOG.md) pe sprinturi, în paralel cu dezvoltarea backend-ului.

---

## 🗺️ Roadmap general

```text
Sprint 1  ██████████  Configurare proiect + servicii API     [DONE]
Sprint 2  ██████████  Autentificare (UI)                     [DONE]
Sprint 3  ██████████  Upload + studiu + evaluare (UI)         [DONE]
Sprint 4  ██████████  Sesiuni de studiu + meniu lateral       [DONE]
Sprint 5  ░░░░░░░░░░  Îmbunătățiri UX                         [PLANIFICAT]
```

---

## Sprint 1 — Configurare proiect 🟢
**Obiectiv:** schelet React + Vite + integrare API.

| Story | Pts |
|---|---|
| FE-01 Proiect React+Vite | 3 |
| FE-02 Strat servicii API | 3 |
| FE-03 URL API configurabil | 2 |

**Velocity:** 8 pts.

---

## Sprint 2 — Autentificare (UI) 🟢
**Obiectiv:** ecran de login/înregistrare funcțional.

| Story | Pts |
|---|---|
| FE-04 Înregistrare | 3 |
| FE-05 Login | 3 |
| FE-06 Comutare login/register | 2 |
| FE-07 Mesaje de eroare | 2 |

**Velocity:** 10 pts.

---

## Sprint 3 — Upload + studiu + evaluare (UI) 🟢
**Obiectiv:** fluxul complet de la PDF la rezultate.

| Story | Pts |
|---|---|
| FE-11…FE-14 Upload + setări | 12 |
| FE-15…FE-18 Studiu + evaluare | 13 |

**Velocity:** 25 pts.

---

## Sprint 4 — Sesiuni de studiu 🟢
**Obiectiv:** meniu lateral și organizarea pe materii.

| Story | Pts | Branch asociat |
|---|---|---|
| FE-08…FE-10 Sesiuni UI | 11 | `feature/menu` |

**Velocity:** 11 pts.

---

## Sprint 5 — Îmbunătățiri UX ⚪ *(planificat)*
**Obiectiv:** rafinarea experienței.

| Story | Pts | Status |
|---|---|---|
| FE-19 Responsive complet | 5 | ⚪ |
| FE-20 Bară de progres | 2 | ⚪ |
| FE-21 Temă light/dark | 3 | ⚪ |
| FE-22 Editare/ștergere sesiuni | 3 | ⚪ |
| FE-23 Animații flashcards | 3 | ⚪ |
| FE-24 Teste de componente | 5 | ⚪ |

**Capacitate planificată:** ~21 pts.

---

## 📈 Burn-down (sumar)

| Sprint | Puncte planificate | Puncte livrate | Cumulativ livrat |
|---|---|---|---|
| 1 | 8 | 8 | 8 |
| 2 | 10 | 10 | 18 |
| 3 | 25 | 25 | 43 |
| 4 | 11 | 11 | 54 |
| 5 | 21 | — | (în desfășurare) |

**Total livrat până acum:** 54 / 75 story points (~72%).

---

## 🔗 Documente conexe
- 📑 [Specificații (SRS)](SPECIFICATII.md)
- 📋 [Backlog de produs](BACKLOG.md)
