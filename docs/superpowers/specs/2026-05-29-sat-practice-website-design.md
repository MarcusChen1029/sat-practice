# SAT Practice Website — Design Spec

**Date:** 2026-05-29
**Status:** Approved (brainstorming phase complete)
**Location:** `C:\Users\user\Desktop\en map\sat-practice`
**Source content:** `C:\Users\user\Desktop\en map\MyPractice - Question Bank - Results.pdf` (84 pages, College Board SAT Question Bank)

---

## 1. Goal

A locally-run, single-user SAT practice website. Loads questions from a College Board PDF question bank into a database, lets the user practice (with hidden-until-answered rationales), take timed mock tests, review wrong answers and bookmarks, and track progress over time.

## 2. Non-goals

- No authentication / multi-tenant accounts.
- No cloud deployment, no remote DB.
- No real-time multiplayer.
- No content beyond what the user supplies via PDF or manual entry.

## 3. Architecture

### 3.1 Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **DB:** SQLite via `better-sqlite3`
- **ORM:** Prisma
- **Charts:** Recharts
- **Validation:** Zod
- **Testing:** Vitest + `next-test-api-route-handler`
- **PDF tooling (ingest only):** Python with `pypdf` / `pdfplumber` / `pdf2image`

Single process. `npm run dev` → `http://localhost:3000`.

### 3.2 Folder layout

```
en map/sat-practice/
├── prisma/
│   ├── schema.prisma
│   └── dev.db                 # gitignored
├── public/
│   └── images/q/<id>.png      # cropped graphs/tables
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home / dashboard
│   │   ├── practice/
│   │   ├── test/
│   │   ├── review/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   ├── lib/db.ts
│   └── lib/types.ts
├── scripts/
│   ├── ingest.ts              # Orchestrates PDF → DB
│   └── crop-images.py
├── data/
│   ├── source.pdf
│   └── work/                  # ingest scratch dir, gitignored
└── docs/superpowers/specs/    # this file
```

## 4. Database schema (Prisma)

```prisma
model Question {
  id              String   @id            // e.g. "2cd8bd76" (from PDF)
  assessment      String                  // "SAT"
  test            String                  // "Reading and Writing" | "Math"
  domain          String
  skill           String
  difficulty      String                  // "Easy" | "Medium" | "Hard"
  stimulus        String
  prompt          String
  correctChoice   String                  // "A" | "B" | "C" | "D"
  rationale       String                  // hidden until answered
  hasVisual       Boolean  @default(false)
  visualType      String?                 // "image" | "table" | "image+data"
  visualImagePath String?                 // "/images/q/2cd8bd76.png"
  visualData      String?                 // JSON-as-string
  sourcePage      Int
  createdAt       DateTime @default(now())

  choices         Choice[]
  attempts        Attempt[]
  bookmark        Bookmark?
}

model Choice {
  id         Int      @id @default(autoincrement())
  questionId String
  letter     String                       // "A" | "B" | "C" | "D"
  text       String
  rationale  String?                      // per-choice explanation, also hidden
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  @@unique([questionId, letter])
}

model Attempt {
  id          Int      @id @default(autoincrement())
  questionId  String
  chosen      String                      // letter picked
  isCorrect   Boolean
  timeSpentMs Int
  mode        String                      // "practice" | "test"
  testId      String?
  createdAt   DateTime @default(now())
  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

model Bookmark {
  questionId String   @id
  note       String?
  createdAt  DateTime @default(now())
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

model TestSession {
  id           String   @id @default(cuid())
  startedAt    DateTime @default(now())
  finishedAt   DateTime?
  durationSec  Int
  questionIds  String                     // JSON array
  status       String                     // "active" | "finished" | "abandoned"
}
```

Notes:
- No `User` table — single-user app, all rows are implicitly "you".
- `Question.id` reuses the PDF's `Question ID` → natural key, idempotent re-imports.
- `visualData` is JSON-as-string because SQLite has no native JSON column.
- Per-choice `rationale` captures "why A/B/D are wrong" — the PDF provides these.

## 5. PDF ingestion pipeline

`scripts/ingest.ts` orchestrates; Python helper does PDF I/O; subagents do the per-question understanding.

**Steps:**

1. **Chunk PDF.** Python helper splits the 84-page PDF into 2-page chunks (question + answer/rationale page). For each chunk, export both pages as 300 DPI PNG and run pdfplumber to extract text. Output `data/work/q-<index>/{question.png, answer.png, text.txt}`.

2. **Dispatch parallel subagents** (via `superpowers:dispatching-parallel-agents`). Each subagent receives one chunk and produces `question.json` matching this schema:
   ```json
   {
     "id": "2cd8bd76",
     "assessment": "SAT",
     "test": "Reading and Writing",
     "domain": "Information and Ideas",
     "skill": "Command of Evidence",
     "difficulty": "Medium",
     "stimulus": "...",
     "prompt": "Which choice most effectively...",
     "choices": [
       { "letter": "A", "text": "...", "rationale": "..." },
       { "letter": "B", "text": "...", "rationale": "..." },
       { "letter": "C", "text": "...", "rationale": "..." },
       { "letter": "D", "text": "...", "rationale": "..." }
     ],
     "correctChoice": "C",
     "rationale": "...",
     "hasVisual": true,
     "visualType": "image+data",
     "visualBbox": [x0, y0, x1, y1],
     "visualData": { "kind": "bar_chart", "series": [...] },
     "sourcePage": 1
   }
   ```
   Subagents run in batches of ~5 to bound parallel cost. Each gets only its own chunk's files → bounded token use, failures don't cascade.

3. **Crop visuals.** If `hasVisual` and `visualBbox` provided, `crop-images.py` crops `question.png` to that bbox and saves to `public/images/q/<id>.png`. `Question.visualImagePath` is set accordingly.

4. **Load into DB.** `ingest.ts` reads each `question.json`, validates with Zod, upserts into SQLite by `id` (so re-runs are safe).

5. **Manual review checkpoint.** Writes `data/work/ingest-report.md` listing every question with status (`ok` / `needs-review` / `failed`). User skims; flagged questions are fixed in the admin UI.

**Idempotency:** Natural-key upsert by `Question.id`; re-running ingestion never duplicates.

**Trade-off acknowledged:** Per-question subagents cost more tokens than one big subagent. The user explicitly authorized this — failures stay isolated, results stay reviewable.

## 6. Pages & UX

### 6.1 `/` — Home / Dashboard
- Prominent **Start Practice** and **Start Timed Test** buttons.
- Stats cards: total attempted, overall accuracy, accuracy per test (R&W / Math), current streak.
- Recharts bar chart: accuracy by domain & by difficulty.
- "Continue last test" link when an active `TestSession` exists.

### 6.2 `/practice` — Practice mode
- Sidebar filter panel: Test, Domain (multi), Skill (multi), Difficulty (multi), Status (Unseen / Wrong / Bookmarked / All).
- Main pane: one `QuestionCard` at a time
  - Stimulus (image rendered above text when `hasVisual`)
  - Prompt
  - Four choice buttons (A/B/C/D)
  - **Submit** button (disabled until a choice is picked)
- After submit:
  - Picked choice → green (correct) or red (wrong); correct choice always green.
  - Rationale panel slides in: overall rationale + per-choice rationale.
  - Buttons: Bookmark, Next question, Back to list.
- Keyboard: `A/B/C/D` to pick, `Enter` to submit, `→` for next.

### 6.3 `/test` — Timed test
- Setup screen: pick test (R&W / Math / Mixed), number of questions (10/20/30/custom), duration (auto-suggested, editable).
- Test screen:
  - Countdown timer in header.
  - Same question card, but **no immediate feedback, no rationale.**
  - "Mark for review", Prev/Next, question palette (1–N grid showing answered/flagged).
- On timeout or "Submit test": review screen with your answer vs correct + rationale revealed.

### 6.4 `/review` — Review wrong + bookmarks
- Two tabs: **Wrong answers** | **Bookmarked**.
- Row: truncated stem, domain/skill chip, difficulty, last-attempt date.
- Click → opens question in practice-style view with rationale already visible.

### 6.5 `/admin` — Import & manage
- **Upload PDF** → kicks off ingest in background; streams progress log.
- **Manual add question** form (all schema fields, image upload).
- Question table with search + edit/delete.

### 6.6 Styling
- Clean, focused — generous whitespace.
- Stimulus: large readable serif (Source Serif or Charter).
- UI: sans-serif.
- Light/dark mode toggle.
- Responsive (tablet friendly).

## 7. API routes

| Method & Path | Purpose |
|---|---|
| `GET /api/questions` | List with filters. Returns stems only — **no rationale**. |
| `GET /api/questions/:id` | Full question + choices. Rationale stripped unless an `Attempt` exists or `mode=review`. |
| `POST /api/attempts` | `{questionId, chosen, timeSpentMs, mode, testId?}`. Server computes `isCorrect`, returns it + full rationale. |
| `POST /api/bookmarks` / `DELETE /api/bookmarks/:id` | Toggle bookmark. |
| `POST /api/tests` | Create `TestSession` with random question selection by filter. |
| `GET /api/tests/:id` | Session + remaining time. |
| `POST /api/tests/:id/finish` | Mark finished, return per-question correctness + rationale. |
| `GET /api/stats` | Aggregated dashboard data. |
| `POST /api/admin/ingest` | Upload PDF + trigger ingest. |
| `POST /api/admin/questions`, `PATCH /:id`, `DELETE /:id` | Manual CRUD. |

**Rationale hiding (critical constraint):** Enforced **server-side**, not just in the frontend. `GET /api/questions/:id` returns `rationale: null` and `choices[].rationale: null` unless the user has already attempted the question (or is in admin/review). The frontend cannot accidentally leak it.

## 8. Error handling

- Zod validation on every request body → 400 with field-level errors.
- Prisma `P2025` (not found) → 404. Other Prisma errors → 500 with safe message; full error logged server-side.
- Ingest errors per-question never fail the batch — written to the report.

## 9. Testing

- **Unit (Vitest):** `lib/` utilities — scoring, filter SQL builders, **rationale stripping**.
- **Integration:** Throwaway SQLite seeded with 3 fixture questions; hit API routes via `next-test-api-route-handler`. Covers:
  - Rationale hidden pre-attempt, returned post-attempt
  - Attempt scoring correct
  - Test session lifecycle (create → answer → finish)
  - Bookmark toggle
- **Manual smoke test:** After ingest, open `/practice`, answer first question, confirm rationale only shows after submit. Acceptance test for MVP.
- TDD for rationale-hiding and scoring — both have visually invisible failure modes.

## 10. Verification before "done"

- `npm run typecheck` clean
- `npm run lint` clean
- `npm test` passes
- Ingest completes with ≤ 5% questions flagged for manual review
- Manual smoke test passes

## 11. Out of scope / future ideas

- Spaced repetition scheduling
- Importing questions from other formats (Quizlet, CSV)
- Note-taking / annotations per question
- Export progress reports to PDF
- Multi-device sync
