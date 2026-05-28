# SAT Practice Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a locally-runnable Next.js + SQLite SAT practice website, then ingest the 84-page College Board PDF via parallel subagents.

**Architecture:** Single Next.js process (frontend + API routes). SQLite via Prisma. Server enforces rationale hiding. Ingest pipeline uses Python helpers for PDF I/O and parallel subagents for per-question understanding.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Prisma + SQLite (`better-sqlite3`), Zod, Vitest, Recharts, Python (pypdf/pdfplumber/pdf2image) for ingest.

**Working directory for ALL tasks:** `C:\Users\user\Desktop\en map\sat-practice`
In bash: `cd "/c/Users/user/Desktop/en map/sat-practice"`. The folder name has a space — always quote it.

**Source PDF:** `C:\Users\user\Desktop\en map\MyPractice - Question Bank - Results.pdf` (will be copied to `data/source.pdf` in Task 17).

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Verify the directory and git repo exist**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && ls -la
```
Expected: shows `docs/` and `.git/` (created in brainstorming phase).

- [ ] **Step 2: Initialize package.json**

Create `package.json`:
```json
{
  "name": "sat-practice",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "ingest": "tsx scripts/ingest.ts"
  }
}
```

- [ ] **Step 3: Install runtime deps**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npm install next@14 react@18 react-dom@18 @prisma/client better-sqlite3 zod recharts clsx
```
Expected: installs without errors. `node_modules/` appears.

- [ ] **Step 4: Install dev deps**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npm install -D typescript @types/react @types/react-dom @types/node @types/better-sqlite3 prisma tsx tailwindcss postcss autoprefixer vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom eslint eslint-config-next
```
Expected: installs without errors.

- [ ] **Step 5: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
export default nextConfig;
```

- [ ] **Step 7: Create `.gitignore`**

```
node_modules
.next
.env*
!.env.example
prisma/dev.db
prisma/dev.db-journal
data/work/
public/images/q/
.DS_Store
*.log
.vitest-cache
```

- [ ] **Step 8: Create `src/app/layout.tsx`**

```tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAT Practice",
  description: "Local SAT practice website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Create `src/app/page.tsx` (placeholder, replaced later)**

```tsx
export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">SAT Practice</h1>
      <p className="mt-4 text-neutral-600">Scaffold OK. Real dashboard coming in Task 14.</p>
    </main>
  );
}
```

- [ ] **Step 10: Create `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 11: Verify the dev server boots**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx next build
```
Expected: builds without errors (Tailwind will be added in Task 2; the build should still succeed because globals.css is valid even without a Tailwind config — Next inlines it).

- [ ] **Step 12: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 1: Scaffold Next.js + TypeScript project"
```

---

## Task 2: Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.ts`, `postcss.config.mjs`
- Modify: `src/app/page.tsx` (verify Tailwind classes render)

- [ ] **Step 1: Init Tailwind config**

Create `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Source Serif Pro"', "Charter", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Create `postcss.config.mjs`**

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 3: Verify Tailwind applies**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx next build
```
Expected: builds; CSS includes Tailwind utility classes (no error about `@tailwind` directives).

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 2: Configure Tailwind CSS"
```

---

## Task 3: Define Prisma schema and create the database

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/db.ts`

- [ ] **Step 1: Create `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Question {
  id              String   @id
  assessment      String
  test            String
  domain          String
  skill           String
  difficulty      String
  stimulus        String
  prompt          String
  correctChoice   String
  rationale       String
  hasVisual       Boolean  @default(false)
  visualType      String?
  visualImagePath String?
  visualData      String?
  sourcePage      Int
  createdAt       DateTime @default(now())

  choices  Choice[]
  attempts Attempt[]
  bookmark Bookmark?
}

model Choice {
  id         Int    @id @default(autoincrement())
  questionId String
  letter     String
  text       String
  rationale  String?
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([questionId, letter])
}

model Attempt {
  id          Int      @id @default(autoincrement())
  questionId  String
  chosen      String
  isCorrect   Boolean
  timeSpentMs Int
  mode        String
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
  id           String    @id @default(cuid())
  startedAt    DateTime  @default(now())
  finishedAt   DateTime?
  durationSec  Int
  questionIds  String
  status       String
}
```

- [ ] **Step 2: Push schema to SQLite**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx prisma db push
```
Expected: "Your database is now in sync with your Prisma schema." `prisma/dev.db` created.

- [ ] **Step 3: Create `src/lib/db.ts`**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Typecheck**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 3: Prisma schema and DB client"
```

---

## Task 4: Shared types and Zod schemas

**Files:**
- Create: `src/lib/types.ts`, `src/lib/schemas.ts`

- [ ] **Step 1: Create `src/lib/types.ts`**

```ts
export type ChoiceLetter = "A" | "B" | "C" | "D";

export type PublicChoice = {
  letter: ChoiceLetter;
  text: string;
};

export type RevealedChoice = PublicChoice & {
  rationale: string | null;
};

export type PublicQuestion = {
  id: string;
  assessment: string;
  test: string;
  domain: string;
  skill: string;
  difficulty: string;
  stimulus: string;
  prompt: string;
  hasVisual: boolean;
  visualType: string | null;
  visualImagePath: string | null;
  visualData: unknown | null;
  sourcePage: number;
  choices: PublicChoice[];
};

export type RevealedQuestion = Omit<PublicQuestion, "choices"> & {
  correctChoice: ChoiceLetter;
  rationale: string;
  choices: RevealedChoice[];
};
```

- [ ] **Step 2: Create `src/lib/schemas.ts`**

```ts
import { z } from "zod";

export const ChoiceLetterSchema = z.enum(["A", "B", "C", "D"]);

export const IngestChoiceSchema = z.object({
  letter: ChoiceLetterSchema,
  text: z.string().min(1),
  rationale: z.string().nullable().optional(),
});

export const IngestQuestionSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{6,12}$/i, "id must be hex-ish from PDF"),
  assessment: z.string(),
  test: z.string(),
  domain: z.string(),
  skill: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  stimulus: z.string(),
  prompt: z.string(),
  choices: z.array(IngestChoiceSchema).length(4),
  correctChoice: ChoiceLetterSchema,
  rationale: z.string(),
  hasVisual: z.boolean(),
  visualType: z.enum(["image", "table", "image+data"]).nullable().optional(),
  visualBbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).nullable().optional(),
  visualData: z.unknown().nullable().optional(),
  sourcePage: z.number().int().positive(),
});
export type IngestQuestion = z.infer<typeof IngestQuestionSchema>;

export const AttemptInputSchema = z.object({
  questionId: z.string(),
  chosen: ChoiceLetterSchema,
  timeSpentMs: z.number().int().nonnegative(),
  mode: z.enum(["practice", "test"]),
  testId: z.string().optional(),
});

export const ListFiltersSchema = z.object({
  test: z.string().optional(),
  domain: z.string().optional(),
  skill: z.string().optional(),
  difficulty: z.string().optional(),
  status: z.enum(["unseen", "wrong", "bookmarked", "all"]).default("all"),
  limit: z.coerce.number().int().positive().max(200).default(50),
  cursor: z.string().optional(),
});

export const CreateTestSchema = z.object({
  test: z.string().optional(),
  domain: z.string().optional(),
  difficulty: z.string().optional(),
  count: z.number().int().min(1).max(100),
  durationSec: z.number().int().min(60),
});
```

- [ ] **Step 3: Typecheck**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 4: Shared types and Zod schemas"
```

---

## Task 5: Vitest setup + rationale-stripping utility (TDD)

**Files:**
- Create: `vitest.config.ts`, `src/lib/reveal.ts`, `src/lib/reveal.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
```

- [ ] **Step 2: Write the failing test**

Create `src/lib/reveal.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { toPublicQuestion, toRevealedQuestion } from "./reveal";

const dbRow = {
  id: "abc123",
  assessment: "SAT",
  test: "Reading and Writing",
  domain: "D",
  skill: "S",
  difficulty: "Medium",
  stimulus: "stim",
  prompt: "prompt",
  correctChoice: "C",
  rationale: "FULL_RATIONALE",
  hasVisual: false,
  visualType: null,
  visualImagePath: null,
  visualData: null,
  sourcePage: 1,
  createdAt: new Date(),
  choices: [
    { id: 1, questionId: "abc123", letter: "A", text: "a", rationale: "ra" },
    { id: 2, questionId: "abc123", letter: "B", text: "b", rationale: "rb" },
    { id: 3, questionId: "abc123", letter: "C", text: "c", rationale: "rc" },
    { id: 4, questionId: "abc123", letter: "D", text: "d", rationale: "rd" },
  ],
};

describe("toPublicQuestion", () => {
  it("strips correctChoice, rationale, and per-choice rationale", () => {
    const pub = toPublicQuestion(dbRow as any);
    expect((pub as any).correctChoice).toBeUndefined();
    expect((pub as any).rationale).toBeUndefined();
    for (const c of pub.choices) {
      expect((c as any).rationale).toBeUndefined();
    }
  });

  it("keeps stimulus, prompt, and choice letters/text", () => {
    const pub = toPublicQuestion(dbRow as any);
    expect(pub.stimulus).toBe("stim");
    expect(pub.choices.map(c => c.letter)).toEqual(["A", "B", "C", "D"]);
    expect(pub.choices[0].text).toBe("a");
  });
});

describe("toRevealedQuestion", () => {
  it("includes correctChoice, rationale, and per-choice rationale", () => {
    const rev = toRevealedQuestion(dbRow as any);
    expect(rev.correctChoice).toBe("C");
    expect(rev.rationale).toBe("FULL_RATIONALE");
    expect(rev.choices[0].rationale).toBe("ra");
  });
});
```

- [ ] **Step 3: Run the test — verify it fails**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/lib/reveal.test.ts
```
Expected: FAIL — cannot find module `./reveal`.

- [ ] **Step 4: Implement `src/lib/reveal.ts`**

```ts
import type { PublicQuestion, RevealedQuestion, ChoiceLetter } from "./types";

type DbChoice = {
  letter: string;
  text: string;
  rationale: string | null;
};

type DbQuestion = {
  id: string;
  assessment: string;
  test: string;
  domain: string;
  skill: string;
  difficulty: string;
  stimulus: string;
  prompt: string;
  correctChoice: string;
  rationale: string;
  hasVisual: boolean;
  visualType: string | null;
  visualImagePath: string | null;
  visualData: string | null;
  sourcePage: number;
  choices: DbChoice[];
};

function parseVisualData(raw: string | null): unknown | null {
  if (raw == null) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function sortChoices(choices: DbChoice[]): DbChoice[] {
  const order = ["A", "B", "C", "D"];
  return [...choices].sort((a, b) => order.indexOf(a.letter) - order.indexOf(b.letter));
}

export function toPublicQuestion(q: DbQuestion): PublicQuestion {
  return {
    id: q.id,
    assessment: q.assessment,
    test: q.test,
    domain: q.domain,
    skill: q.skill,
    difficulty: q.difficulty,
    stimulus: q.stimulus,
    prompt: q.prompt,
    hasVisual: q.hasVisual,
    visualType: q.visualType,
    visualImagePath: q.visualImagePath,
    visualData: parseVisualData(q.visualData),
    sourcePage: q.sourcePage,
    choices: sortChoices(q.choices).map(c => ({
      letter: c.letter as ChoiceLetter,
      text: c.text,
    })),
  };
}

export function toRevealedQuestion(q: DbQuestion): RevealedQuestion {
  return {
    ...toPublicQuestion(q),
    correctChoice: q.correctChoice as ChoiceLetter,
    rationale: q.rationale,
    choices: sortChoices(q.choices).map(c => ({
      letter: c.letter as ChoiceLetter,
      text: c.text,
      rationale: c.rationale,
    })),
  };
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/lib/reveal.test.ts
```
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 5: Rationale-stripping utility (TDD)"
```

---

## Task 6: Scoring utility (TDD)

**Files:**
- Create: `src/lib/scoring.ts`, `src/lib/scoring.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/scoring.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { isCorrect } from "./scoring";

describe("isCorrect", () => {
  it("returns true when chosen matches correctChoice", () => {
    expect(isCorrect("C", "C")).toBe(true);
  });
  it("returns false when chosen does not match", () => {
    expect(isCorrect("A", "C")).toBe(false);
  });
  it("is case-sensitive (DB stores uppercase letters)", () => {
    expect(isCorrect("c" as any, "C")).toBe(false);
  });
});
```

- [ ] **Step 2: Run — verify it fails**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/lib/scoring.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/scoring.ts`**

```ts
import type { ChoiceLetter } from "./types";
export function isCorrect(chosen: ChoiceLetter, correct: ChoiceLetter): boolean {
  return chosen === correct;
}
```

- [ ] **Step 4: Run — verify it passes**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/lib/scoring.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 6: Scoring utility (TDD)"
```

---

## Task 7: Filter SQL builder (TDD)

**Files:**
- Create: `src/lib/filters.ts`, `src/lib/filters.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/filters.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildQuestionWhere } from "./filters";

describe("buildQuestionWhere", () => {
  it("returns empty object when no filters", () => {
    expect(buildQuestionWhere({ status: "all", limit: 50 })).toEqual({});
  });
  it("filters by test/domain/skill/difficulty", () => {
    const w = buildQuestionWhere({
      test: "Math", domain: "Algebra", skill: "Linear", difficulty: "Hard",
      status: "all", limit: 50,
    });
    expect(w).toEqual({ test: "Math", domain: "Algebra", skill: "Linear", difficulty: "Hard" });
  });
  it("filters by bookmarked status", () => {
    const w = buildQuestionWhere({ status: "bookmarked", limit: 50 });
    expect(w).toEqual({ bookmark: { isNot: null } });
  });
  it("filters by unseen status", () => {
    const w = buildQuestionWhere({ status: "unseen", limit: 50 });
    expect(w).toEqual({ attempts: { none: {} } });
  });
  it("filters by wrong status", () => {
    const w = buildQuestionWhere({ status: "wrong", limit: 50 });
    expect(w).toEqual({ attempts: { some: { isCorrect: false } } });
  });
});
```

- [ ] **Step 2: Run — verify it fails**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/lib/filters.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/filters.ts`**

```ts
import type { z } from "zod";
import type { ListFiltersSchema } from "./schemas";

type Filters = z.infer<typeof ListFiltersSchema>;

export function buildQuestionWhere(f: Filters): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  if (f.test) where.test = f.test;
  if (f.domain) where.domain = f.domain;
  if (f.skill) where.skill = f.skill;
  if (f.difficulty) where.difficulty = f.difficulty;
  if (f.status === "bookmarked") where.bookmark = { isNot: null };
  else if (f.status === "unseen") where.attempts = { none: {} };
  else if (f.status === "wrong") where.attempts = { some: { isCorrect: false } };
  return where;
}
```

- [ ] **Step 4: Run — verify it passes**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/lib/filters.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 7: Filter SQL builder (TDD)"
```

---

## Task 8: Test fixtures helper

**Files:**
- Create: `src/test/fixtures.ts`

- [ ] **Step 1: Create `src/test/fixtures.ts`**

```ts
import { prisma } from "@/lib/db";

export async function resetDb() {
  await prisma.attempt.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.testSession.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();
}

export async function seedQuestion(id: string, overrides: Partial<{
  test: string; domain: string; skill: string; difficulty: string;
  correctChoice: "A" | "B" | "C" | "D";
}> = {}) {
  return prisma.question.create({
    data: {
      id,
      assessment: "SAT",
      test: overrides.test ?? "Reading and Writing",
      domain: overrides.domain ?? "Information and Ideas",
      skill: overrides.skill ?? "Command of Evidence",
      difficulty: overrides.difficulty ?? "Medium",
      stimulus: `stim ${id}`,
      prompt: `prompt ${id}`,
      correctChoice: overrides.correctChoice ?? "C",
      rationale: `rationale ${id}`,
      hasVisual: false,
      sourcePage: 1,
      choices: {
        create: (["A", "B", "C", "D"] as const).map(letter => ({
          letter,
          text: `${letter} text`,
          rationale: `${letter} rationale`,
        })),
      },
    },
  });
}
```

- [ ] **Step 2: Typecheck**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 8: Test fixtures helper"
```

---

## Task 9: `GET /api/questions` and `GET /api/questions/:id` (TDD)

**Files:**
- Create: `src/app/api/questions/route.ts`, `src/app/api/questions/[id]/route.ts`, `src/app/api/questions/route.test.ts`, `src/app/api/questions/[id]/route.test.ts`

- [ ] **Step 1: Write failing test for list route**

Create `src/app/api/questions/route.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { resetDb, seedQuestion } from "@/test/fixtures";

describe("GET /api/questions", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("aaa111", { test: "Math" });
    await seedQuestion("bbb222", { test: "Reading and Writing" });
  });

  it("returns all questions when no filter", async () => {
    const req = new Request("http://x/api/questions");
    const res = await GET(req);
    const body = await res.json();
    expect(body.items).toHaveLength(2);
  });

  it("filters by test param", async () => {
    const req = new Request("http://x/api/questions?test=Math");
    const res = await GET(req);
    const body = await res.json();
    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe("aaa111");
  });

  it("never returns rationale or correctChoice in list", async () => {
    const req = new Request("http://x/api/questions");
    const res = await GET(req);
    const body = await res.json();
    for (const item of body.items) {
      expect(item.rationale).toBeUndefined();
      expect(item.correctChoice).toBeUndefined();
    }
  });
});
```

- [ ] **Step 2: Run — verify it fails**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/questions/route.test.ts`
Expected: FAIL — route module not found.

- [ ] **Step 3: Implement `src/app/api/questions/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ListFiltersSchema } from "@/lib/schemas";
import { buildQuestionWhere } from "@/lib/filters";
import { toPublicQuestion } from "@/lib/reveal";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = ListFiltersSchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const where = buildQuestionWhere(parsed.data);
  const rows = await prisma.question.findMany({
    where,
    include: { choices: true },
    orderBy: { id: "asc" },
    take: parsed.data.limit,
  });
  return NextResponse.json({
    items: rows.map(r => {
      const pub = toPublicQuestion(r as any);
      // List view: stems only — strip choices
      return { ...pub, choices: undefined };
    }),
  });
}
```

- [ ] **Step 4: Write failing test for detail route**

Create `src/app/api/questions/[id]/route.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { resetDb, seedQuestion } from "@/test/fixtures";
import { prisma } from "@/lib/db";

describe("GET /api/questions/:id", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("ddd444");
  });

  it("hides rationale and correctChoice when no attempt exists", async () => {
    const res = await GET(new Request("http://x/api/questions/ddd444"), { params: { id: "ddd444" } });
    const body = await res.json();
    expect(body.rationale).toBeUndefined();
    expect(body.correctChoice).toBeUndefined();
    for (const c of body.choices) expect(c.rationale).toBeUndefined();
  });

  it("reveals rationale when an attempt exists", async () => {
    await prisma.attempt.create({
      data: { questionId: "ddd444", chosen: "A", isCorrect: false, timeSpentMs: 1000, mode: "practice" },
    });
    const res = await GET(new Request("http://x/api/questions/ddd444"), { params: { id: "ddd444" } });
    const body = await res.json();
    expect(body.rationale).toBe("rationale ddd444");
    expect(body.correctChoice).toBe("C");
  });

  it("reveals rationale when ?reveal=1 (for review)", async () => {
    const res = await GET(new Request("http://x/api/questions/ddd444?reveal=1"), { params: { id: "ddd444" } });
    const body = await res.json();
    expect(body.rationale).toBe("rationale ddd444");
  });

  it("returns 404 for unknown id", async () => {
    const res = await GET(new Request("http://x/api/questions/missing"), { params: { id: "missing" } });
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 5: Run — verify it fails**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/questions/[id]/route.test.ts`
Expected: FAIL.

- [ ] **Step 6: Implement `src/app/api/questions/[id]/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toPublicQuestion, toRevealedQuestion } from "@/lib/reveal";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const reveal = url.searchParams.get("reveal") === "1";
  const row = await prisma.question.findUnique({
    where: { id: params.id },
    include: { choices: true, attempts: { take: 1 } },
  });
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  const hasAttempt = row.attempts.length > 0;
  if (reveal || hasAttempt) {
    return NextResponse.json(toRevealedQuestion(row as any));
  }
  return NextResponse.json(toPublicQuestion(row as any));
}
```

- [ ] **Step 7: Run all tests**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 9: Question list and detail API routes (TDD)"
```

---

## Task 10: `POST /api/attempts` (TDD)

**Files:**
- Create: `src/app/api/attempts/route.ts`, `src/app/api/attempts/route.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/app/api/attempts/route.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { resetDb, seedQuestion } from "@/test/fixtures";

describe("POST /api/attempts", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("eee555", { correctChoice: "C" });
  });

  it("returns isCorrect=true and full rationale when correct answer chosen", async () => {
    const req = new Request("http://x/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "eee555", chosen: "C", timeSpentMs: 5000, mode: "practice" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.isCorrect).toBe(true);
    expect(body.question.rationale).toBe("rationale eee555");
    expect(body.question.correctChoice).toBe("C");
  });

  it("returns isCorrect=false when wrong answer chosen", async () => {
    const req = new Request("http://x/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "eee555", chosen: "A", timeSpentMs: 5000, mode: "practice" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.isCorrect).toBe(false);
  });

  it("returns 400 on invalid body", async () => {
    const req = new Request("http://x/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "eee555", chosen: "Z" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run — verify it fails**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/attempts/route.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/app/api/attempts/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AttemptInputSchema } from "@/lib/schemas";
import { isCorrect } from "@/lib/scoring";
import { toRevealedQuestion } from "@/lib/reveal";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = AttemptInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const q = await prisma.question.findUnique({
    where: { id: parsed.data.questionId },
    include: { choices: true },
  });
  if (!q) return NextResponse.json({ error: "question not found" }, { status: 404 });

  const correct = isCorrect(parsed.data.chosen, q.correctChoice as any);
  await prisma.attempt.create({
    data: {
      questionId: q.id,
      chosen: parsed.data.chosen,
      isCorrect: correct,
      timeSpentMs: parsed.data.timeSpentMs,
      mode: parsed.data.mode,
      testId: parsed.data.testId,
    },
  });

  return NextResponse.json({
    isCorrect: correct,
    question: toRevealedQuestion(q as any),
  });
}
```

- [ ] **Step 4: Run — verify it passes**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/attempts/route.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 10: Attempts API (TDD)"
```

---

## Task 11: Bookmarks API

**Files:**
- Create: `src/app/api/bookmarks/route.ts`, `src/app/api/bookmarks/[id]/route.ts`, `src/app/api/bookmarks/route.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/app/api/bookmarks/route.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { DELETE } from "./[id]/route";
import { resetDb, seedQuestion } from "@/test/fixtures";
import { prisma } from "@/lib/db";

describe("Bookmarks API", () => {
  beforeEach(async () => {
    await resetDb();
    await seedQuestion("fff666");
  });

  it("POST creates a bookmark", async () => {
    const req = new Request("http://x/api/bookmarks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: "fff666" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const found = await prisma.bookmark.findUnique({ where: { questionId: "fff666" } });
    expect(found).not.toBeNull();
  });

  it("DELETE removes a bookmark", async () => {
    await prisma.bookmark.create({ data: { questionId: "fff666" } });
    const res = await DELETE(new Request("http://x"), { params: { id: "fff666" } });
    expect(res.status).toBe(200);
    const found = await prisma.bookmark.findUnique({ where: { questionId: "fff666" } });
    expect(found).toBeNull();
  });
});
```

- [ ] **Step 2: Run — verify fails**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/bookmarks/route.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/app/api/bookmarks/route.ts`**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const BodySchema = z.object({ questionId: z.string(), note: z.string().optional() });

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const b = await prisma.bookmark.upsert({
    where: { questionId: parsed.data.questionId },
    create: { questionId: parsed.data.questionId, note: parsed.data.note },
    update: { note: parsed.data.note },
  });
  return NextResponse.json(b);
}
```

- [ ] **Step 4: Implement `src/app/api/bookmarks/[id]/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.bookmark.deleteMany({ where: { questionId: params.id } });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 5: Run — verify passes**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/bookmarks/route.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 11: Bookmarks API"
```

---

## Task 12: Test sessions API

**Files:**
- Create: `src/app/api/tests/route.ts`, `src/app/api/tests/[id]/route.ts`, `src/app/api/tests/[id]/finish/route.ts`, `src/app/api/tests/route.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/app/api/tests/route.test.ts`:
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { POST as finishPost } from "./[id]/finish/route";
import { resetDb, seedQuestion } from "@/test/fixtures";
import { prisma } from "@/lib/db";

describe("Test sessions", () => {
  beforeEach(async () => {
    await resetDb();
    for (const id of ["q1", "q2", "q3"]) await seedQuestion(id);
  });

  it("POST creates a session with the requested question count", async () => {
    const req = new Request("http://x/api/tests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count: 2, durationSec: 600 }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.status).toBe("active");
    const ids = JSON.parse(body.questionIds);
    expect(ids).toHaveLength(2);
  });

  it("finish marks session as finished and returns per-question results", async () => {
    const session = await prisma.testSession.create({
      data: { durationSec: 600, questionIds: JSON.stringify(["q1", "q2"]), status: "active" },
    });
    await prisma.attempt.create({
      data: { questionId: "q1", chosen: "C", isCorrect: true, timeSpentMs: 1000, mode: "test", testId: session.id },
    });
    const res = await finishPost(new Request("http://x"), { params: { id: session.id } });
    const body = await res.json();
    expect(body.status).toBe("finished");
    expect(body.results).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run — verify fails**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/tests/route.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/app/api/tests/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateTestSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = CreateTestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const where: Record<string, unknown> = {};
  if (parsed.data.test) where.test = parsed.data.test;
  if (parsed.data.domain) where.domain = parsed.data.domain;
  if (parsed.data.difficulty) where.difficulty = parsed.data.difficulty;

  // Random selection: fetch all matching IDs, shuffle, take N.
  const matching = await prisma.question.findMany({ where, select: { id: true } });
  const shuffled = matching.map(m => m.id).sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, parsed.data.count);
  if (picked.length < parsed.data.count) {
    return NextResponse.json({ error: `Only ${picked.length} questions match the filter` }, { status: 400 });
  }
  const session = await prisma.testSession.create({
    data: {
      durationSec: parsed.data.durationSec,
      questionIds: JSON.stringify(picked),
      status: "active",
    },
  });
  return NextResponse.json(session);
}
```

- [ ] **Step 4: Implement `src/app/api/tests/[id]/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const s = await prisma.testSession.findUnique({ where: { id: params.id } });
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });
  const elapsed = Math.floor((Date.now() - s.startedAt.getTime()) / 1000);
  const remaining = Math.max(0, s.durationSec - elapsed);
  return NextResponse.json({ ...s, remainingSec: remaining });
}
```

- [ ] **Step 5: Implement `src/app/api/tests/[id]/finish/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toRevealedQuestion } from "@/lib/reveal";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const s = await prisma.testSession.update({
    where: { id: params.id },
    data: { status: "finished", finishedAt: new Date() },
  });
  const ids: string[] = JSON.parse(s.questionIds);
  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    include: { choices: true, attempts: { where: { testId: s.id } } },
  });
  const results = questions.map(q => ({
    question: toRevealedQuestion(q as any),
    attempt: q.attempts[0] ?? null,
  }));
  return NextResponse.json({ status: s.status, results });
}
```

- [ ] **Step 6: Run — verify passes**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx vitest run src/app/api/tests/route.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 12: Test sessions API"
```

---

## Task 13: Stats API

**Files:**
- Create: `src/app/api/stats/route.ts`

- [ ] **Step 1: Implement**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const totalAttempts = await prisma.attempt.count();
  const correctAttempts = await prisma.attempt.count({ where: { isCorrect: true } });
  const byTest = await prisma.$queryRawUnsafe<Array<{ test: string; total: number; correct: number }>>(
    `SELECT q.test as test, COUNT(*) as total, SUM(CASE WHEN a.isCorrect THEN 1 ELSE 0 END) as correct
     FROM Attempt a JOIN Question q ON q.id = a.questionId GROUP BY q.test`
  );
  const byDomain = await prisma.$queryRawUnsafe<Array<{ domain: string; total: number; correct: number }>>(
    `SELECT q.domain as domain, COUNT(*) as total, SUM(CASE WHEN a.isCorrect THEN 1 ELSE 0 END) as correct
     FROM Attempt a JOIN Question q ON q.id = a.questionId GROUP BY q.domain`
  );
  const byDifficulty = await prisma.$queryRawUnsafe<Array<{ difficulty: string; total: number; correct: number }>>(
    `SELECT q.difficulty as difficulty, COUNT(*) as total, SUM(CASE WHEN a.isCorrect THEN 1 ELSE 0 END) as correct
     FROM Attempt a JOIN Question q ON q.id = a.questionId GROUP BY q.difficulty`
  );
  return NextResponse.json({
    totalAttempts,
    correctAttempts,
    overallAccuracy: totalAttempts > 0 ? correctAttempts / totalAttempts : 0,
    byTest, byDomain, byDifficulty,
  });
}
```

- [ ] **Step 2: Typecheck and commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit && git add -A && git commit -m "Task 13: Stats API"
```

---

## Task 14: Shared UI components

**Files:**
- Create: `src/components/QuestionCard.tsx`, `src/components/ChoiceButton.tsx`, `src/components/RationalePanel.tsx`, `src/components/NavBar.tsx`, `src/components/StatChip.tsx`

- [ ] **Step 1: Create `src/components/ChoiceButton.tsx`**

```tsx
"use client";
import clsx from "clsx";

type State = "idle" | "selected" | "correct" | "wrong" | "revealed-correct";

export function ChoiceButton({
  letter, text, state, onClick, disabled,
}: {
  letter: string;
  text: string;
  state: State;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full text-left rounded-lg border px-4 py-3 transition",
        "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        state === "idle" && "border-neutral-300 dark:border-neutral-700",
        state === "selected" && "border-blue-500 bg-blue-50 dark:bg-blue-950",
        state === "correct" && "border-green-600 bg-green-50 dark:bg-green-950",
        state === "wrong" && "border-red-600 bg-red-50 dark:bg-red-950",
        state === "revealed-correct" && "border-green-600 bg-green-50 dark:bg-green-950",
        disabled && "cursor-not-allowed opacity-80"
      )}
    >
      <span className="mr-3 inline-block w-6 font-semibold">{letter}.</span>
      <span>{text}</span>
    </button>
  );
}
```

- [ ] **Step 2: Create `src/components/RationalePanel.tsx`**

```tsx
"use client";
import type { RevealedQuestion } from "@/lib/types";

export function RationalePanel({ q, chosen }: { q: RevealedQuestion; chosen: string }) {
  return (
    <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-neutral-500">Correct answer:</span>
        <span className="text-lg font-bold text-green-600">{q.correctChoice}</span>
        {chosen !== q.correctChoice && (
          <span className="ml-3 text-sm text-red-600">You chose: {chosen}</span>
        )}
      </div>
      <h3 className="text-base font-semibold">Why {q.correctChoice} is correct</h3>
      <p className="mt-1 whitespace-pre-line text-neutral-700 dark:text-neutral-300">{q.rationale}</p>
      <h3 className="mt-4 text-base font-semibold">Per-choice explanations</h3>
      <ul className="mt-2 space-y-2">
        {q.choices.map(c => (
          <li key={c.letter} className="text-sm">
            <span className="font-semibold">{c.letter}.</span>{" "}
            <span className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">{c.rationale ?? "(no per-choice explanation)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/QuestionCard.tsx`**

```tsx
"use client";
import Image from "next/image";
import type { PublicQuestion } from "@/lib/types";

export function QuestionCard({ q, children }: { q: PublicQuestion; children: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.test}</span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.domain}</span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.skill}</span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">{q.difficulty}</span>
      </div>
      {q.hasVisual && q.visualImagePath && (
        <div className="my-4">
          <Image src={q.visualImagePath} alt="Question visual" width={700} height={400} className="rounded border" />
        </div>
      )}
      <p className="whitespace-pre-line font-serif text-lg leading-relaxed">{q.stimulus}</p>
      <p className="mt-4 font-medium">{q.prompt}</p>
      <div className="mt-5 space-y-2">{children}</div>
    </article>
  );
}
```

- [ ] **Step 4: Create `src/components/NavBar.tsx`**

```tsx
import Link from "next/link";

export function NavBar() {
  return (
    <nav className="border-b border-neutral-200 bg-white px-6 py-3 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-5xl items-center gap-6">
        <Link href="/" className="font-semibold">SAT Practice</Link>
        <Link href="/practice" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">Practice</Link>
        <Link href="/test" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">Timed Test</Link>
        <Link href="/review" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">Review</Link>
        <Link href="/admin" className="ml-auto text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">Admin</Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 5: Create `src/components/StatChip.tsx`**

```tsx
export function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="text-xs uppercase text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
```

- [ ] **Step 6: Typecheck and commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit && git add -A && git commit -m "Task 14: Shared UI components"
```

---

## Task 15: Practice page

**Files:**
- Create: `src/app/practice/page.tsx`, `src/app/practice/PracticeClient.tsx`

- [ ] **Step 1: Create server page `src/app/practice/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { PracticeClient } from "./PracticeClient";

export default function PracticePage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Practice</h1>
        <PracticeClient />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Create client component `src/app/practice/PracticeClient.tsx`**

```tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { ChoiceButton } from "@/components/ChoiceButton";
import { RationalePanel } from "@/components/RationalePanel";
import type { PublicQuestion, RevealedQuestion } from "@/lib/types";

type FilterState = {
  test: string; domain: string; skill: string; difficulty: string;
  status: "all" | "unseen" | "wrong" | "bookmarked";
};

export function PracticeClient() {
  const [filters, setFilters] = useState<FilterState>({ test: "", domain: "", skill: "", difficulty: "", status: "all" });
  const [list, setList] = useState<PublicQuestion[]>([]);
  const [cursor, setCursor] = useState(0);
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState<RevealedQuestion | null>(null);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  const loadList = useCallback(async () => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v && v !== "all") params.set(k, v);
    const res = await fetch(`/api/questions?${params}`);
    const data = await res.json();
    setList(data.items);
    setCursor(0);
  }, [filters]);

  useEffect(() => { loadList(); }, [loadList]);

  useEffect(() => {
    if (list.length === 0) { setQuestion(null); return; }
    const id = list[cursor]?.id;
    if (!id) return;
    fetch(`/api/questions/${id}`).then(r => r.json()).then(q => {
      setQuestion(q);
      setChosen(null); setSubmitted(false); setRevealed(null);
      setStartedAt(Date.now());
    });
  }, [list, cursor]);

  async function submit() {
    if (!question || !chosen) return;
    const res = await fetch("/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionId: question.id, chosen, timeSpentMs: Date.now() - startedAt, mode: "practice",
      }),
    });
    const data = await res.json();
    setSubmitted(true);
    setRevealed(data.question);
  }

  function next() {
    if (cursor + 1 < list.length) setCursor(cursor + 1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question) return;
      if (!submitted && /^[abcd]$/i.test(e.key)) setChosen(e.key.toUpperCase());
      else if (!submitted && e.key === "Enter" && chosen) submit();
      else if (submitted && e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="grid gap-6 md:grid-cols-[200px,1fr]">
      <aside className="space-y-3">
        <label className="block text-sm">Test
          <select className="mt-1 w-full rounded border px-2 py-1 dark:bg-neutral-900" value={filters.test} onChange={e => setFilters({ ...filters, test: e.target.value })}>
            <option value="">Any</option>
            <option>Reading and Writing</option>
            <option>Math</option>
          </select>
        </label>
        <label className="block text-sm">Difficulty
          <select className="mt-1 w-full rounded border px-2 py-1 dark:bg-neutral-900" value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
            <option value="">Any</option><option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </label>
        <label className="block text-sm">Status
          <select className="mt-1 w-full rounded border px-2 py-1 dark:bg-neutral-900" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value as FilterState["status"] })}>
            <option value="all">All</option><option value="unseen">Unseen</option><option value="wrong">Wrong</option><option value="bookmarked">Bookmarked</option>
          </select>
        </label>
        <div className="text-xs text-neutral-500">{list.length === 0 ? "No questions match" : `${cursor + 1} / ${list.length}`}</div>
      </aside>
      <section>
        {!question ? (
          <p className="text-neutral-500">{list.length === 0 ? "No questions match filters." : "Loading..."}</p>
        ) : (
          <>
            <QuestionCard q={question}>
              {question.choices.map(c => {
                const isCorrect = revealed?.correctChoice === c.letter;
                let state: "idle" | "selected" | "correct" | "wrong" | "revealed-correct" = "idle";
                if (!submitted && chosen === c.letter) state = "selected";
                else if (submitted && chosen === c.letter) state = isCorrect ? "correct" : "wrong";
                else if (submitted && isCorrect) state = "revealed-correct";
                return (
                  <ChoiceButton
                    key={c.letter} letter={c.letter} text={c.text} state={state}
                    onClick={() => !submitted && setChosen(c.letter)}
                    disabled={submitted}
                  />
                );
              })}
            </QuestionCard>
            <div className="mt-4 flex gap-3">
              {!submitted ? (
                <button onClick={submit} disabled={!chosen}
                  className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-40">
                  Submit
                </button>
              ) : (
                <button onClick={next} className="rounded bg-neutral-800 px-4 py-2 font-medium text-white dark:bg-neutral-200 dark:text-neutral-900">
                  Next question →
                </button>
              )}
              {submitted && question && (
                <button onClick={async () => {
                  await fetch("/api/bookmarks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ questionId: question.id }) });
                }} className="rounded border px-4 py-2">Bookmark</button>
              )}
            </div>
            {revealed && <RationalePanel q={revealed} chosen={chosen!} />}
          </>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck and commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit && git add -A && git commit -m "Task 15: Practice page"
```

---

## Task 16: Timed test page (setup + active + results)

**Files:**
- Create: `src/app/test/page.tsx`, `src/app/test/TestSetup.tsx`, `src/app/test/[id]/page.tsx`, `src/app/test/[id]/TestRunner.tsx`, `src/app/test/[id]/results/page.tsx`

- [ ] **Step 1: Create `src/app/test/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { TestSetup } from "./TestSetup";

export default function TestPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Timed Test</h1>
        <TestSetup />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/test/TestSetup.tsx`**

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TestSetup() {
  const router = useRouter();
  const [test, setTest] = useState("");
  const [count, setCount] = useState(10);
  const [durationMin, setDurationMin] = useState(15);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function start() {
    setBusy(true); setErr(null);
    const res = await fetch("/api/tests", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ test: test || undefined, count, durationSec: durationMin * 60 }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(typeof data.error === "string" ? data.error : "Failed to start"); return; }
    router.push(`/test/${data.id}`);
  }

  return (
    <div className="space-y-4 rounded border p-6">
      <label className="block text-sm">Section
        <select value={test} onChange={e => setTest(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2 dark:bg-neutral-900">
          <option value="">Mixed</option>
          <option>Reading and Writing</option>
          <option>Math</option>
        </select>
      </label>
      <label className="block text-sm">Number of questions
        <input type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))}
          className="mt-1 block w-full rounded border px-3 py-2 dark:bg-neutral-900" />
      </label>
      <label className="block text-sm">Duration (minutes)
        <input type="number" min={1} max={180} value={durationMin} onChange={e => setDurationMin(Number(e.target.value))}
          className="mt-1 block w-full rounded border px-3 py-2 dark:bg-neutral-900" />
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} onClick={start} className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-40">
        {busy ? "Starting..." : "Start test"}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/test/[id]/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { TestRunner } from "./TestRunner";

export default function TestRunPage({ params }: { params: { id: string } }) {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <TestRunner sessionId={params.id} />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Create `src/app/test/[id]/TestRunner.tsx`**

```tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/QuestionCard";
import { ChoiceButton } from "@/components/ChoiceButton";
import type { PublicQuestion } from "@/lib/types";

export function TestRunner({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [question, setQuestion] = useState<PublicQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [remaining, setRemaining] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<number>(Date.now());

  useEffect(() => {
    fetch(`/api/tests/${sessionId}`).then(r => r.json()).then(s => {
      setIds(JSON.parse(s.questionIds));
      setRemaining(s.remainingSec);
    });
  }, [sessionId]);

  useEffect(() => {
    const id = ids[idx];
    if (!id) return;
    fetch(`/api/questions/${id}`).then(r => r.json()).then(setQuestion);
    setStartedAt(Date.now());
  }, [ids, idx]);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  const finish = useCallback(async () => {
    await fetch(`/api/tests/${sessionId}/finish`, { method: "POST" });
    router.push(`/test/${sessionId}/results`);
  }, [sessionId, router]);

  useEffect(() => { if (remaining === 0 && ids.length > 0) finish(); }, [remaining, ids.length, finish]);

  async function recordAnswer(letter: string) {
    if (!question) return;
    setAnswers(a => ({ ...a, [question.id]: letter }));
    await fetch("/api/attempts", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionId: question.id, chosen: letter,
        timeSpentMs: Date.now() - startedAt, mode: "test", testId: sessionId,
      }),
    });
  }

  function toggleFlag() {
    if (!question) return;
    const s = new Set(flagged);
    s.has(question.id) ? s.delete(question.id) : s.add(question.id);
    setFlagged(s);
  }

  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-xl">{mm}:{ss}</div>
        <button onClick={finish} className="rounded bg-red-600 px-3 py-1 text-sm text-white">Submit test</button>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr,180px]">
        <section>
          {question && (
            <>
              <QuestionCard q={question}>
                {question.choices.map(c => (
                  <ChoiceButton key={c.letter} letter={c.letter} text={c.text}
                    state={answers[question.id] === c.letter ? "selected" : "idle"}
                    onClick={() => recordAnswer(c.letter)} />
                ))}
              </QuestionCard>
              <div className="mt-4 flex gap-3">
                <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="rounded border px-3 py-1 disabled:opacity-40">← Prev</button>
                <button onClick={toggleFlag} className="rounded border px-3 py-1">
                  {flagged.has(question.id) ? "Unflag" : "Mark for review"}
                </button>
                <button disabled={idx >= ids.length - 1} onClick={() => setIdx(idx + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Next →</button>
              </div>
            </>
          )}
        </section>
        <aside>
          <div className="grid grid-cols-5 gap-1">
            {ids.map((qid, i) => (
              <button key={qid} onClick={() => setIdx(i)}
                className={
                  "rounded border px-2 py-1 text-sm " +
                  (i === idx ? "ring-2 ring-blue-500 " : "") +
                  (answers[qid] ? "bg-blue-100 dark:bg-blue-900 " : "") +
                  (flagged.has(qid) ? "border-yellow-500 " : "")
                }>
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Create `src/app/test/[id]/results/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { prisma } from "@/lib/db";
import { toRevealedQuestion } from "@/lib/reveal";
import { RationalePanel } from "@/components/RationalePanel";

export default async function TestResultsPage({ params }: { params: { id: string } }) {
  const session = await prisma.testSession.findUnique({ where: { id: params.id } });
  if (!session) return <main className="p-6">Not found.</main>;
  const ids: string[] = JSON.parse(session.questionIds);
  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    include: { choices: true, attempts: { where: { testId: session.id } } },
  });
  const correctCount = questions.filter(q => q.attempts[0]?.isCorrect).length;

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="mt-2 text-lg">Score: <strong>{correctCount}</strong> / {questions.length}</p>
        <div className="mt-6 space-y-8">
          {questions.map(q => {
            const rev = toRevealedQuestion(q as any);
            const attempt = q.attempts[0];
            return (
              <div key={q.id} className="border-t pt-4">
                <p className="font-serif">{q.stimulus}</p>
                <p className="mt-2 font-medium">{q.prompt}</p>
                <RationalePanel q={rev} chosen={attempt?.chosen ?? ""} />
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 6: Typecheck and commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit && git add -A && git commit -m "Task 16: Timed test pages"
```

---

## Task 17: Home/dashboard page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/HomeClient.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { StatChip } from "@/components/StatChip";
import { HomeClient } from "./HomeClient";

async function fetchStats() {
  const res = await fetch("http://localhost:3000/api/stats", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function HomePage() {
  const stats = await fetchStats();
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatChip label="Attempted" value={stats?.totalAttempts ?? 0} />
          <StatChip label="Correct" value={stats?.correctAttempts ?? 0} />
          <StatChip label="Accuracy" value={`${Math.round((stats?.overallAccuracy ?? 0) * 100)}%`} />
        </div>
        <HomeClient stats={stats} />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/HomeClient.tsx`**

```tsx
"use client";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function HomeClient({ stats }: { stats: any }) {
  const domainData = (stats?.byDomain ?? []).map((d: any) => ({
    name: d.domain, accuracy: d.total > 0 ? Math.round((Number(d.correct) / Number(d.total)) * 100) : 0,
  }));
  return (
    <>
      <div className="mt-6 flex gap-3">
        <Link href="/practice" className="rounded bg-blue-600 px-4 py-2 font-medium text-white">Start practice</Link>
        <Link href="/test" className="rounded bg-neutral-800 px-4 py-2 font-medium text-white dark:bg-neutral-200 dark:text-neutral-900">Start timed test</Link>
        <Link href="/review" className="rounded border px-4 py-2">Review</Link>
      </div>
      {domainData.length > 0 && (
        <div className="mt-8 h-64 rounded border bg-white p-4 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-semibold">Accuracy by domain</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={domainData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: Typecheck and commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit && git add -A && git commit -m "Task 17: Home dashboard page"
```

---

## Task 18: Review page

**Files:**
- Create: `src/app/review/page.tsx`, `src/app/review/ReviewClient.tsx`

- [ ] **Step 1: Create `src/app/review/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { ReviewClient } from "./ReviewClient";

export default function ReviewPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Review</h1>
        <ReviewClient />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Create `src/app/review/ReviewClient.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { id: string; stimulus: string; domain: string; skill: string; difficulty: string };

export function ReviewClient() {
  const [tab, setTab] = useState<"wrong" | "bookmarked">("wrong");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`/api/questions?status=${tab}&limit=100`).then(r => r.json()).then(d => setItems(d.items));
  }, [tab]);

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab("wrong")} className={"rounded px-3 py-1 " + (tab === "wrong" ? "bg-blue-600 text-white" : "border")}>Wrong</button>
        <button onClick={() => setTab("bookmarked")} className={"rounded px-3 py-1 " + (tab === "bookmarked" ? "bg-blue-600 text-white" : "border")}>Bookmarked</button>
      </div>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-neutral-500">Nothing here yet.</li>}
        {items.map(it => (
          <li key={it.id} className="rounded border p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <Link href={`/review/${it.id}`} className="block">
              <div className="text-xs text-neutral-500">{it.domain} • {it.skill} • {it.difficulty}</div>
              <div className="line-clamp-2 mt-1 font-serif">{it.stimulus}</div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

- [ ] **Step 3: Create review-detail page `src/app/review/[id]/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { prisma } from "@/lib/db";
import { toRevealedQuestion } from "@/lib/reveal";
import { RationalePanel } from "@/components/RationalePanel";

export default async function ReviewDetail({ params }: { params: { id: string } }) {
  const q = await prisma.question.findUnique({ where: { id: params.id }, include: { choices: true, attempts: { take: 1, orderBy: { createdAt: "desc" } } } });
  if (!q) return <main className="p-6">Not found.</main>;
  const rev = toRevealedQuestion(q as any);
  const last = q.attempts[0];
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl p-6">
        <p className="whitespace-pre-line font-serif text-lg">{q.stimulus}</p>
        <p className="mt-4 font-medium">{q.prompt}</p>
        <RationalePanel q={rev} chosen={last?.chosen ?? ""} />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Typecheck and commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit && git add -A && git commit -m "Task 18: Review page"
```

---

## Task 19: Admin page — manual question CRUD

**Files:**
- Create: `src/app/admin/page.tsx`, `src/app/admin/AdminClient.tsx`, `src/app/api/admin/questions/route.ts`, `src/app/api/admin/questions/[id]/route.ts`

- [ ] **Step 1: Implement `src/app/api/admin/questions/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { IngestQuestionSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const parsed = IngestQuestionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;
  const q = await prisma.question.upsert({
    where: { id: d.id },
    create: {
      id: d.id, assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual,
      visualType: d.visualType ?? null,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
      choices: { create: d.choices.map(c => ({ letter: c.letter, text: c.text, rationale: c.rationale ?? null })) },
    },
    update: {
      assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual,
      visualType: d.visualType ?? null,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
    },
  });
  return NextResponse.json(q);
}
```

- [ ] **Step 2: Implement `src/app/api/admin/questions/[id]/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.question.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create `src/app/admin/page.tsx`**

```tsx
import { NavBar } from "@/components/NavBar";
import { AdminClient } from "./AdminClient";

export default function AdminPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Admin</h1>
        <AdminClient />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Create `src/app/admin/AdminClient.tsx`**

```tsx
"use client";
import { useState } from "react";

export function AdminClient() {
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function runIngest(file: File) {
    setBusy(true);
    setLog(l => [...l, `Uploading ${file.name}...`]);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/ingest", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    setLog(l => [...l, JSON.stringify(data)]);
    setBusy(false);
  }

  return (
    <>
      <section className="rounded border p-4">
        <h2 className="font-semibold">Import questions from PDF</h2>
        <input type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && runIngest(e.target.files[0])} disabled={busy} className="mt-2" />
        <pre className="mt-3 max-h-64 overflow-auto rounded bg-neutral-100 p-3 text-xs dark:bg-neutral-900">
          {log.join("\n")}
        </pre>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Typecheck and commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit && git add -A && git commit -m "Task 19: Admin page and admin questions API"
```

---

## Task 20: PDF chunking script (Python)

**Files:**
- Create: `scripts/chunk_pdf.py`, `data/.gitkeep`

- [ ] **Step 1: Copy source PDF**

Run:
```bash
mkdir -p "/c/Users/user/Desktop/en map/sat-practice/data" && cp "/c/Users/user/Desktop/en map/MyPractice - Question Bank - Results.pdf" "/c/Users/user/Desktop/en map/sat-practice/data/source.pdf"
```

- [ ] **Step 2: Install Python deps**

Run: `pip install pypdf pdfplumber pdf2image Pillow`

Expected: installs OK. (`pdf2image` requires Poppler; if missing on Windows, install via `choco install poppler` or skip image rendering — we already have pypdf for text extraction; the rasterization happens via pdfplumber's page.to_image which uses GhostScript/Pillow. If unavailable, the subagents can read text-only chunks.)

- [ ] **Step 3: Create `scripts/chunk_pdf.py`**

```python
"""Split source PDF into per-question chunks.

Each College Board question spans 2 pages: a question page + an answer page that
starts with "ID: <hex> Answer". We pair consecutive (q_page, a_page) tuples and
write each pair to data/work/q-<index>/{question.txt, answer.txt, question.png}.
"""
import sys, re, json, os
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "source.pdf"
OUT = ROOT / "data" / "work"

def main():
    if not SRC.exists():
        print(f"Source PDF missing: {SRC}", file=sys.stderr); sys.exit(1)
    OUT.mkdir(parents=True, exist_ok=True)

    reader = PdfReader(str(SRC))
    pages_text = [p.extract_text() or "" for p in reader.pages]
    n = len(pages_text)

    # Heuristic: every question page starts with "Question ID <hex>", and the
    # answer page starts with "ID: <hex> Answer". Pair them by hex id.
    question_pages = {}  # qid -> page_index
    answer_pages = {}    # qid -> page_index
    for i, t in enumerate(pages_text):
        m_q = re.search(r"Question ID\s+([a-f0-9]{6,12})", t)
        m_a = re.search(r"^ID:\s+([a-f0-9]{6,12})\s+Answer", t, re.M)
        if m_a: answer_pages[m_a.group(1)] = i
        elif m_q: question_pages[m_q.group(1)] = i

    chunks = []
    for qid, qi in question_pages.items():
        ai = answer_pages.get(qid)
        if ai is None:
            print(f"WARN: no answer page for {qid}"); continue
        chunks.append({"id": qid, "q_page": qi, "a_page": ai})

    print(f"Found {len(chunks)} question chunks")

    # Save chunks and images
    with pdfplumber.open(str(SRC)) as pdf:
        for idx, c in enumerate(chunks):
            d = OUT / f"q-{idx:03d}-{c['id']}"
            d.mkdir(exist_ok=True)
            (d / "question.txt").write_text(pages_text[c["q_page"]], encoding="utf-8")
            (d / "answer.txt").write_text(pages_text[c["a_page"]], encoding="utf-8")
            (d / "meta.json").write_text(json.dumps({
                "id": c["id"],
                "q_page": c["q_page"] + 1,  # 1-based
                "a_page": c["a_page"] + 1,
            }, indent=2), encoding="utf-8")
            # Try to render question page as PNG (for visual inspection by subagent)
            try:
                img = pdf.pages[c["q_page"]].to_image(resolution=200)
                img.save(str(d / "question.png"), format="PNG")
            except Exception as e:
                print(f"Could not render page {c['q_page']+1} as PNG: {e}")

    print(f"Wrote chunks to {OUT}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run the chunker**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && python scripts/chunk_pdf.py`
Expected: prints "Found N question chunks" with N ≈ 40, writes `data/work/q-XXX-<id>/`.

- [ ] **Step 5: Commit (scripts only — data/work is gitignored)**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 20: PDF chunking script"
```

---

## Task 21: Image-crop helper + ingest orchestrator

**Files:**
- Create: `scripts/crop_image.py`, `scripts/ingest.ts`, `src/lib/ingestLoad.ts`

- [ ] **Step 1: Create `scripts/crop_image.py`**

```python
"""Crop a region from a PNG. Called by ingest.ts when a subagent reports visualBbox."""
import sys, json
from pathlib import Path
from PIL import Image

def main():
    args = json.loads(sys.argv[1])
    src = Path(args["src"]); dst = Path(args["dst"])
    bbox = args["bbox"]  # [x0, y0, x1, y1] in PDF points; PNG was 200 DPI so px = pt * 200/72
    scale = 200.0 / 72.0
    px_bbox = (int(bbox[0] * scale), int(bbox[1] * scale), int(bbox[2] * scale), int(bbox[3] * scale))
    img = Image.open(src)
    img.crop(px_bbox).save(dst)
    print(json.dumps({"ok": True, "dst": str(dst)}))

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Create `src/lib/ingestLoad.ts`**

```ts
import { prisma } from "@/lib/db";
import type { IngestQuestion } from "@/lib/schemas";

export async function upsertIngestQuestion(d: IngestQuestion, visualImagePath: string | null) {
  return prisma.question.upsert({
    where: { id: d.id },
    create: {
      id: d.id, assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual, visualType: d.visualType ?? null, visualImagePath,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
      choices: { create: d.choices.map(c => ({ letter: c.letter, text: c.text, rationale: c.rationale ?? null })) },
    },
    update: {
      assessment: d.assessment, test: d.test, domain: d.domain, skill: d.skill,
      difficulty: d.difficulty, stimulus: d.stimulus, prompt: d.prompt,
      correctChoice: d.correctChoice, rationale: d.rationale,
      hasVisual: d.hasVisual, visualType: d.visualType ?? null, visualImagePath,
      visualData: d.visualData != null ? JSON.stringify(d.visualData) : null,
      sourcePage: d.sourcePage,
    },
  });
}
```

- [ ] **Step 3: Create `scripts/ingest.ts`**

```ts
/* Orchestrator: scans data/work/q-XXX-<id>/question.json (produced by subagents)
   and loads each into the DB. Crops visuals if visualBbox is present. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { IngestQuestionSchema } from "../src/lib/schemas";
import { upsertIngestQuestion } from "../src/lib/ingestLoad";

const ROOT = path.resolve(__dirname, "..");
const WORK = path.join(ROOT, "data", "work");
const IMG_DIR = path.join(ROOT, "public", "images", "q");
const REPORT = path.join(WORK, "ingest-report.md");

async function main() {
  await fs.mkdir(IMG_DIR, { recursive: true });
  const entries = (await fs.readdir(WORK, { withFileTypes: true }))
    .filter(d => d.isDirectory() && d.name.startsWith("q-"))
    .map(d => path.join(WORK, d.name));

  const lines: string[] = ["# Ingest report", ""];
  let ok = 0, skipped = 0, failed = 0;

  for (const dir of entries) {
    const jsonPath = path.join(dir, "question.json");
    try {
      const exists = await fs.stat(jsonPath).then(() => true).catch(() => false);
      if (!exists) { skipped++; lines.push(`- ${path.basename(dir)}: SKIP — no question.json`); continue; }
      const raw = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
      const parsed = IngestQuestionSchema.safeParse(raw);
      if (!parsed.success) { failed++; lines.push(`- ${path.basename(dir)}: FAIL — schema: ${JSON.stringify(parsed.error.flatten())}`); continue; }

      let visualImagePath: string | null = null;
      if (parsed.data.hasVisual && parsed.data.visualBbox) {
        const dst = path.join(IMG_DIR, `${parsed.data.id}.png`);
        const src = path.join(dir, "question.png");
        const r = spawnSync("python", [path.join(ROOT, "scripts", "crop_image.py"), JSON.stringify({ src, dst, bbox: parsed.data.visualBbox })]);
        if (r.status === 0) visualImagePath = `/images/q/${parsed.data.id}.png`;
        else lines.push(`  - crop failed: ${r.stderr?.toString()}`);
      }

      await upsertIngestQuestion(parsed.data, visualImagePath);
      ok++; lines.push(`- ${path.basename(dir)}: OK (${parsed.data.id})`);
    } catch (e: any) {
      failed++; lines.push(`- ${path.basename(dir)}: ERROR — ${e?.message ?? e}`);
    }
  }

  lines.push("", `**Summary:** ${ok} ok, ${skipped} skipped, ${failed} failed`);
  await fs.writeFile(REPORT, lines.join("\n"), "utf-8");
  console.log(`Done. Report at ${REPORT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 4: Typecheck**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 21: Ingest orchestrator and crop helper"
```

---

## Task 22: Subagent dispatch — extract per-question JSON

**Note:** This task runs the actual data ingestion. Use `superpowers:dispatching-parallel-agents` to dispatch one subagent per chunk directory. Each subagent receives this exact prompt:

> You are given a directory at `<dir>` containing `question.txt`, `answer.txt`, `meta.json`, and possibly `question.png`. Your job is to read these files and produce a JSON file at `<dir>/question.json` that conforms exactly to this Zod schema:
>
> ```ts
> {
>   id: string,                  // from meta.json "id"
>   assessment: "SAT",
>   test: "Reading and Writing" | "Math",
>   domain: string,              // e.g. "Information and Ideas"
>   skill: string,               // e.g. "Command of Evidence"
>   difficulty: "Easy" | "Medium" | "Hard",
>   stimulus: string,            // The passage/setup text only — NOT the prompt or choices
>   prompt: string,              // The question sentence ("Which choice...", "What is...")
>   choices: [
>     { letter: "A", text: string, rationale: string },
>     { letter: "B", text: string, rationale: string },
>     { letter: "C", text: string, rationale: string },
>     { letter: "D", text: string, rationale: string }
>   ],
>   correctChoice: "A" | "B" | "C" | "D",
>   rationale: string,           // Overall rationale for the correct choice from answer.txt
>   hasVisual: boolean,          // true if the question references a chart/graph/table
>   visualType: "image" | "table" | "image+data" | null,
>   visualBbox: [x0, y0, x1, y1] | null,  // PDF points (1pt = 1/72 in). If you can identify the visual region, give bbox; else null. Page is ~612×792 pt.
>   visualData: object | null,   // Structured chart/table data if extractable (e.g. {kind:"bar_chart", series:[{label, values:[]}]})
>   sourcePage: number           // q_page from meta.json
> }
> ```
>
> Rules:
> - Reproduce text exactly as it appears (preserve em-dashes, curly quotes).
> - The PDF answer page lists rationales per choice in paragraphs starting "Choice X is..."; extract each into the matching choices[].rationale. The overall rationale is the first paragraph of the explanation.
> - Difficulty appears in the question page as "Question Difficulty: Easy/Medium/Hard" (or you can infer from "Diﬃculty" field on the question page).
> - If the question has a visual: set hasVisual:true. If you can also read off numeric data (bar values, table cells), include visualData with a sensible shape.
> - Write ONLY the JSON file. No other output. If anything is unclear or extraction is impossible, still write a JSON file with your best guess and set `"_needs_review": true` as an extra top-level key.

- [ ] **Step 1: List the chunk directories**

Run: `ls "/c/Users/user/Desktop/en map/sat-practice/data/work"`
Expected: ~40 `q-XXX-<id>/` directories.

- [ ] **Step 2: Dispatch parallel subagents in batches of 5**

For each batch (5 chunks at a time), launch 5 subagents in parallel via `superpowers:dispatching-parallel-agents`. Pass each subagent the absolute path of its chunk directory and the prompt above.

After each batch, verify every directory now contains `question.json`. Re-dispatch missing ones.

- [ ] **Step 3: Run the ingest orchestrator**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && npx tsx scripts/ingest.ts`
Expected: produces `data/work/ingest-report.md` with ≥ 95% "OK" entries. Failed/needs-review entries are listed for manual fix in the admin UI.

- [ ] **Step 4: Sanity-check DB row count**

Run: `cd "/c/Users/user/Desktop/en map/sat-practice" && node -e "const p = new (require('@prisma/client')).PrismaClient(); p.question.count().then(c => { console.log('questions:', c); return p.\$disconnect(); })"`
Expected: ~40 (close to the chunk count).

- [ ] **Step 5: Commit (data/work and images stay gitignored; report file we want)**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add data/work/ingest-report.md -f && git add -A && git commit -m "Task 22: Initial PDF ingest results"
```

---

## Task 23: Admin upload route + final verification

**Files:**
- Create: `src/app/api/admin/ingest/route.ts`
- Create: `README.md`

- [ ] **Step 1: Create `src/app/api/admin/ingest/route.ts`**

```ts
import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
  const root = process.cwd();
  const dest = path.join(root, "data", "source.pdf");
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));

  // Chunk + load. NOTE: subagent extraction is offline-only; this endpoint only re-chunks
  // and re-loads existing question.json files.
  const chunk = spawnSync("python", [path.join(root, "scripts", "chunk_pdf.py")], { encoding: "utf-8" });
  const ingest = spawnSync("npx", ["tsx", path.join(root, "scripts", "ingest.ts")], { encoding: "utf-8", shell: true });

  return NextResponse.json({
    chunkOutput: chunk.stdout, chunkErr: chunk.stderr,
    ingestOutput: ingest.stdout, ingestErr: ingest.stderr,
  });
}
```

- [ ] **Step 2: Create `README.md`**

```markdown
# SAT Practice (local)

A local Next.js + SQLite SAT practice site.

## Setup

```bash
npm install
npx prisma db push
```

## Ingest the question bank (one-time)

```bash
# 1. Drop your PDF at data/source.pdf (default already in place)
python scripts/chunk_pdf.py
# 2. Use Claude or another agent per chunk to write data/work/q-XXX-<id>/question.json
# 3. Load into DB:
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
npm run lint
npm test
```
```

- [ ] **Step 3: Run full verification**

Run:
```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && npm run typecheck && npm test
```
Expected: typecheck clean; all tests pass.

- [ ] **Step 4: Manual smoke test**

Run: `npm run dev` (in background or another shell), open `http://localhost:3000`.
Click "Start practice". Pick a question, choose an answer, click Submit.
**Expected:** Rationale panel appears only AFTER submit. Refresh the page before answering — confirm `GET /api/questions/<id>` in Network tab returns no `rationale` field.

- [ ] **Step 5: Commit final state**

```bash
cd "/c/Users/user/Desktop/en map/sat-practice" && git add -A && git commit -m "Task 23: Admin upload route, README, and verification"
```

---

## Self-review (completed by plan author)

**Spec coverage:**
- §3 architecture → Tasks 1–4
- §4 schema → Task 3
- §5 ingest → Tasks 20–22
- §6 pages: dashboard (17), practice (15), test (16), review (18), admin (19)
- §7 API routes → Tasks 9–13, 19, 23 (rationale hiding tested in Task 9)
- §8 error handling → Zod 400s in 9/10/11/12/19/23; 404s in 9/16/18
- §9 testing → unit + integration coverage in Tasks 5–7, 9–12
- §10 verification → Task 23 Step 3

**Placeholder scan:** none.

**Type consistency:** `ChoiceLetter`, `PublicQuestion`, `RevealedQuestion`, `IngestQuestion` all match across tasks. `buildQuestionWhere` signature matches `ListFiltersSchema`. `toRevealedQuestion` consumed in Tasks 9, 10, 12, 16, 18.

---

## Execution

Recommended: **Subagent-driven execution.** Dispatch one fresh subagent per task; review between tasks. Task 22 is the most expensive (parallel subagents per PDF chunk) — that's the explicit token spend the user authorized.

Alternative: inline execution via `superpowers:executing-plans`.
