"""Split source PDF into per-question chunks.

Structure discovered by inspection (84 pages, 56 questions):

  Case A (52 questions): question + answer + rationale on ONE page.
    The page contains both "Question ID <hex>" and "ID: <hex> Answer".
    Sometimes the rationale overflows onto the immediately following page
    (which has no ID marker of its own).

  Case B (4 questions): question is so long (large graph) that it occupies
    page N alone, and the answer begins on page N+1 ("ID: <hex> Answer").

The original bug was an elif that assigned Case A pages only to answer_pages,
ignoring the question content, leaving just the 4 Case B question pages in
question_pages — none of which found a match since their answers were on
page N+1 (filed in answer_pages under the same id, but the elif kept Case B
question pages out of question_pages entirely). Net result: 0 matched chunks.

Fix: scan each page for both patterns independently (no elif).  For Case A
the question page IS the answer page — concatenate any overflow page and put
everything in question.txt, leaving answer.txt empty.  For Case B write
question.txt from the question page and answer.txt from the answer page,
appending overflow pages to answer.txt.

Downstream contract per chunk directory:
  question.txt  — full text of the question page(s), always present
  answer.txt    — full text of the separate answer page(s), or empty string
  meta.json     — {id, q_pages: [1-based], a_pages: [1-based], case}
  question.png  — raster render of the first question page at 200 dpi
"""
import sys, re, json
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

ROOT = Path(__file__).resolve().parent.parent
SRC  = ROOT / "data" / "source.pdf"
OUT  = ROOT / "data" / "work"

# Both patterns use re.I so they are case-insensitive (IDs are lowercase hex
# in this PDF, but being lenient costs nothing).
RE_Q = re.compile(r"Question ID\s+([0-9a-f]{6,12})", re.I)
RE_A = re.compile(r"ID:\s+([0-9a-f]{6,12})\s+Answer", re.I)


def is_overflow(text: str) -> bool:
    """Return True if this page has no ID marker — it's a rationale overflow."""
    return not RE_Q.search(text) and not RE_A.search(text)


def main():
    if not SRC.exists():
        print(f"Source PDF missing: {SRC}", file=sys.stderr)
        sys.exit(1)
    OUT.mkdir(parents=True, exist_ok=True)

    reader = PdfReader(str(SRC))
    pages_text = [p.extract_text() or "" for p in reader.pages]
    n = len(pages_text)
    print(f"PDF has {n} pages")

    # First pass: record which pages carry each kind of marker.
    # A page may carry BOTH (Case A), so scan independently.
    q_pages: dict[str, list[int]] = {}   # id -> [page indices]
    a_pages: dict[str, list[int]] = {}   # id -> [page indices]

    for i, t in enumerate(pages_text):
        m_q = RE_Q.search(t)
        m_a = RE_A.search(t)
        if m_q:
            q_pages.setdefault(m_q.group(1), []).append(i)
        if m_a:
            a_pages.setdefault(m_a.group(1), []).append(i)

    print(f"Unique Question IDs found: {len(q_pages)}")
    print(f"Unique Answer IDs found:   {len(a_pages)}")

    # Build chunks.
    chunks = []
    for qid, qp_list in sorted(q_pages.items(), key=lambda kv: kv[1][0]):
        q_idx = qp_list[0]           # first (only) question page index
        ap_list = a_pages.get(qid, [])

        if not ap_list:
            print(f"WARN: no answer marker for {qid} (q_page={q_idx+1})")
            continue

        a_idx = ap_list[0]           # first answer page index

        if q_idx == a_idx:
            # Case A: question and answer are on the same page.
            # Collect any immediately following overflow pages.
            overflow = []
            j = q_idx + 1
            while j < n and is_overflow(pages_text[j]):
                overflow.append(j)
                j += 1
            chunks.append({
                "id":      qid,
                "case":    "A",
                "q_pages": [q_idx] + overflow,
                "a_pages": [],
            })
        else:
            # Case B: separate question page and answer page.
            # Collect overflow pages after the answer page.
            overflow = []
            j = a_idx + 1
            while j < n and is_overflow(pages_text[j]):
                overflow.append(j)
                j += 1
            chunks.append({
                "id":      qid,
                "case":    "B",
                "q_pages": [q_idx],
                "a_pages": [a_idx] + overflow,
            })

    print(f"Found {len(chunks)} question chunks "
          f"({sum(1 for c in chunks if c['case']=='A')} case-A, "
          f"{sum(1 for c in chunks if c['case']=='B')} case-B)")

    with pdfplumber.open(str(SRC)) as pdf:
        for idx, c in enumerate(chunks):
            d = OUT / f"q-{idx:03d}-{c['id']}"
            d.mkdir(exist_ok=True)

            q_text = "\n".join(pages_text[i] for i in c["q_pages"])
            a_text = "\n".join(pages_text[i] for i in c["a_pages"])

            (d / "question.txt").write_text(q_text, encoding="utf-8")
            (d / "answer.txt").write_text(a_text,   encoding="utf-8")
            (d / "meta.json").write_text(json.dumps({
                "id":      c["id"],
                "case":    c["case"],
                "q_pages": [i + 1 for i in c["q_pages"]],
                "a_pages": [i + 1 for i in c["a_pages"]],
            }, indent=2), encoding="utf-8")

            # Render the first question page as a PNG thumbnail.
            try:
                img = pdf.pages[c["q_pages"][0]].to_image(resolution=200)
                img.save(str(d / "question.png"), format="PNG")
            except Exception as e:
                print(f"Could not render page {c['q_pages'][0]+1} as PNG: {e}")

    print(f"Wrote chunks to {OUT}")


if __name__ == "__main__":
    main()
