"""Split source PDF into per-question chunks.

Each College Board question spans 2 pages: a question page + an answer page that
starts with "ID: <hex> Answer". We pair them by hex id and write each pair to
data/work/q-<index>-<id>/{question.txt, answer.txt, meta.json, question.png}.
"""
import sys, re, json
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
    print(f"PDF has {n} pages")

    # Heuristic: every question page starts with "Question ID <hex>", and the
    # answer page starts with "ID: <hex> Answer". Pair them by hex id.
    question_pages = {}
    answer_pages = {}
    for i, t in enumerate(pages_text):
        m_q = re.search(r"Question ID\s+([a-f0-9]{6,12})", t)
        m_a = re.search(r"^ID:\s+([a-f0-9]{6,12})\s+Answer", t, re.M)
        if m_a:
            answer_pages[m_a.group(1)] = i
        elif m_q:
            question_pages[m_q.group(1)] = i

    chunks = []
    for qid, qi in question_pages.items():
        ai = answer_pages.get(qid)
        if ai is None:
            print(f"WARN: no answer page for {qid}"); continue
        chunks.append({"id": qid, "q_page": qi, "a_page": ai})

    print(f"Found {len(chunks)} question chunks")

    with pdfplumber.open(str(SRC)) as pdf:
        for idx, c in enumerate(chunks):
            d = OUT / f"q-{idx:03d}-{c['id']}"
            d.mkdir(exist_ok=True)
            (d / "question.txt").write_text(pages_text[c["q_page"]], encoding="utf-8")
            (d / "answer.txt").write_text(pages_text[c["a_page"]], encoding="utf-8")
            (d / "meta.json").write_text(json.dumps({
                "id": c["id"],
                "q_page": c["q_page"] + 1,
                "a_page": c["a_page"] + 1,
            }, indent=2), encoding="utf-8")
            try:
                img = pdf.pages[c["q_page"]].to_image(resolution=200)
                img.save(str(d / "question.png"), format="PNG")
            except Exception as e:
                print(f"Could not render page {c['q_page']+1} as PNG: {e}")

    print(f"Wrote chunks to {OUT}")

if __name__ == "__main__":
    main()
