# 📋 Backlog de produs — NeuroDeck (Frontend)

> **Produs:** NeuroDeck — generator de flashcards din PDF cu AI
> **Tip document:** Product Backlog (metodologie agilă / Scrum) — perspectiva frontend
> **Ultima actualizare:** 2026-06-15

Acest backlog conține **epicele** și **user story-urile** componentei frontend NeuroDeck. Estimarea folosește **story points** (Fibonacci), iar prioritizarea metoda **MoSCoW**.

> 💡 Fiecare user story devine un **Issue** pe GitHub, urmărit pe **Project board**. Planificarea pe sprinturi: [`SPRINTURI.md`](SPRINTURI.md).

---

## Legendă

| Simbol | Status | | Prioritate | Semnificație |
|---|---|---|---|---|
| 🟢 | Done | | **Must** | Esențial pentru MVP |
| 🟡 | In Progress | | **Should** | Important, dar nu blocant |
| ⚪ | To Do | | **Could** | De dorit dacă rămâne timp |
| | | | **Won't (now)** | Amânat |

**Story points:** `1` trivial · `2` mic · `3` mediu · `5` mare · `8` foarte mare

---

## 🧩 EPIC-A — Configurare proiect frontend
*Schelet React + Vite + integrare API.*

| ID | User story | Prioritate | Pts | Status |
|---|---|---|---|---|
| FE-01 | Ca **dezvoltator**, vreau un proiect React + Vite ca să am o bază modernă și rapidă. | Must | 3 | 🟢 |
| FE-02 | Ca **dezvoltator**, vreau un strat de servicii API (axios) ca să centralizez apelurile la backend. | Must | 3 | 🟢 |
| FE-03 | Ca **dezvoltator**, vreau un URL de API configurabil ca să schimb ușor mediul. | Should | 2 | 🟢 |

---

## 🧩 EPIC-B — Autentificare (UI)
*Ecranul de login / înregistrare.*

| ID | User story | Prioritate | Pts | Status |
|---|---|---|---|---|
| FE-04 | Ca **vizitator**, vreau un formular de înregistrare ca să-mi creez cont. | Must | 3 | 🟢 |
| FE-05 | Ca **vizitator**, vreau un formular de login ca să intru în cont. | Must | 3 | 🟢 |
| FE-06 | Ca **vizitator**, vreau să comut între login și înregistrare ca să folosesc același ecran. | Should | 2 | 🟢 |
| FE-07 | Ca **utilizator**, vreau mesaje de eroare clare la autentificare ca să știu ce am greșit. | Should | 2 | 🟢 |

---

## 🧩 EPIC-C — Sesiuni de studiu (UI)
*Meniul lateral și navigarea între sesiuni.*

| ID | User story | Prioritate | Pts | Status |
|---|---|---|---|---|
| FE-08 | Ca **utilizator**, vreau un meniu lateral cu sesiunile mele ca să navighez ușor. | Must | 5 | 🟢 |
| FE-09 | Ca **utilizator**, vreau să creez o sesiune nouă din interfață ca să-mi organizez materiile. | Must | 3 | 🟢 |
| FE-10 | Ca **utilizator**, vreau să selectez o sesiune ca să-i văd flashcards-urile. | Must | 3 | 🟢 |

---

## 🧩 EPIC-D — Încărcare documente (UI)
*Zona drag & drop și setările de generare.*

| ID | User story | Prioritate | Pts | Status |
|---|---|---|---|---|
| FE-11 | Ca **utilizator**, vreau o zonă drag & drop ca să încarc PDF-uri ușor. | Must | 5 | 🟢 |
| FE-12 | Ca **utilizator**, vreau să încarc mai multe PDF-uri deodată ca să combin materiale. | Should | 3 | 🟢 |
| FE-13 | Ca **utilizator**, vreau să aleg numărul de întrebări ca să controlez dimensiunea setului. | Should | 2 | 🟢 |
| FE-14 | Ca **utilizator**, vreau să aleg severitatea evaluării ca să ajustez exigența. | Could | 2 | 🟢 |

---

## 🧩 EPIC-E — Studiu & evaluare (UI)
*Parcurgerea flashcards-urilor și afișarea rezultatelor.*

| ID | User story | Prioritate | Pts | Status |
|---|---|---|---|---|
| FE-15 | Ca **utilizator**, vreau să parcurg flashcards-urile una câte una ca să mă concentrez. | Must | 5 | 🟢 |
| FE-16 | Ca **utilizator**, vreau un câmp de răspuns pentru fiecare flashcard ca să mă autoevaluez. | Must | 3 | 🟢 |
| FE-17 | Ca **utilizator**, vreau să văd scorul și verdictul ca să-mi măsor progresul. | Must | 3 | 🟢 |
| FE-18 | Ca **utilizator**, vreau indicatori de încărcare în timpul generării AI ca să știu că lucrează. | Should | 2 | 🟢 |

---

## 🧩 EPIC-F — Îmbunătățiri UX *(viitor)*
*Rafinări pentru o experiență mai bună.*

| ID | User story | Prioritate | Pts | Status |
|---|---|---|---|---|
| FE-19 | Ca **utilizator**, vreau un design responsive complet ca să folosesc aplicația pe telefon. | Should | 5 | ⚪ |
| FE-20 | Ca **utilizator**, vreau o bară de progres la studiu ca să văd câte carduri mai am. | Could | 2 | ⚪ |
| FE-21 | Ca **utilizator**, vreau temă luminoasă/întunecată ca să reduc oboseala vizuală. | Could | 3 | ⚪ |
| FE-22 | Ca **utilizator**, vreau să pot edita/șterge sesiuni din UI ca să le gestionez complet. | Should | 3 | ⚪ |
| FE-23 | Ca **utilizator**, vreau animații/feedback la flip-ul flashcard-urilor ca să fie mai plăcut. | Could | 3 | ⚪ |
| FE-24 | Ca **dezvoltator**, vreau teste de componente ca să previn regresiile UI. | Should | 5 | ⚪ |

---

## 📊 Sumar backlog

| Epic | Story-uri | Total puncte | Done |
|---|---|---|---|
| EPIC-A Configurare | 3 | 8 | 🟢 100% |
| EPIC-B Autentificare UI | 4 | 10 | 🟢 100% |
| EPIC-C Sesiuni UI | 3 | 11 | 🟢 100% |
| EPIC-D Upload UI | 4 | 12 | 🟢 100% |
| EPIC-E Studiu & evaluare | 4 | 13 | 🟢 100% |
| EPIC-F UX *(viitor)* | 6 | 21 | ⚪ 0% |
| **Total** | **24** | **75** | **~72% livrat** |

---

## 🔗 Documente conexe
- 📑 [Specificații (SRS)](SPECIFICATII.md)
- 🏃 [Planificare sprinturi](SPRINTURI.md)
