# SAT Practice (local)

A locally-runnable SAT practice website built with Next.js, TypeScript, Tailwind, Prisma, and SQLite. Designed for solo study with a focus on clean UI, instant feedback after answering, and the ability to review wrong/bookmarked questions.

## Features

- **Practice mode** with filters (test, difficulty, status: unseen/wrong/bookmarked/all). Rationale is hidden until you submit your answer.
- **Timed test mode** with countdown timer, question palette, mark-for-review, and per-question review at the end.
- **Dashboard** showing total attempts, accuracy, and accuracy-by-domain bar chart.
- **Review** section for wrong answers and bookmarks.
- **Admin** upload to re-ingest the source PDF (limited to re-chunking + re-loading existing JSON; full extraction requires an LLM agent).
- **56 SAT questions** loaded from the College Board Question Bank export.

## Setup

```bash
npm install
npx prisma db push
```

Questions are already in `prisma/dev.db` if you cloned this repo with the seeded DB. To re-ingest:

## Ingest the question bank (one-time)

```bash
# 1. Drop your PDF at data/source.pdf
# 2. Chunk it into per-question text files:
python scripts/chunk_pdf.py
# 3. (Manual) Use Claude or another LLM to produce data/work/q-XXX-<id>/question.json for each chunk.
# 4. Load into DB:
npx tsx scripts/ingest.ts
```

## Run

```bash
npm run dev
# Open http://localhost:3000
```

## Verify

```bash
npm run typecheck
npm test
npx next build
```

## Architecture

- **Frontend + backend in one process** via Next.js 14 App Router. API routes live under `src/app/api/`.
- **SQLite** via Prisma 7 + better-sqlite3 driver adapter — no external DB needed.
- **Rationale hiding** is enforced server-side: `GET /api/questions/:id` returns no rationale fields unless an attempt exists for that question (or `?reveal=1` for review).
- **Strategy** for the PDF ingest: split into per-question chunks via Python (`scripts/chunk_pdf.py`), then have parallel LLM subagents read each chunk and produce structured JSON, then load via `scripts/ingest.ts`.

## File layout

```
src/
  app/                # Next.js App Router (pages + API routes)
    api/              # REST endpoints
    practice/         # /practice page
    test/             # /test, /test/[id], /test/[id]/results
    review/           # /review, /review/[id]
    admin/            # /admin
  components/         # Shared React components
  lib/                # db, types, schemas, reveal, scoring, filters, ingestLoad
  test/               # Vitest fixtures
prisma/
  schema.prisma       # Models: Question, Choice, Attempt, Bookmark, TestSession
  dev.db              # SQLite DB
scripts/
  chunk_pdf.py        # Split PDF into per-question chunks
  crop_image.py       # Crop a region from a question PNG
  ingest.ts           # Load question.json files into DB
data/
  source.pdf          # Source question bank
  work/               # Per-question chunks (gitignored)
public/
  images/q/           # Cropped question visuals (gitignored)
```
