"""Diagnostic script to inspect source.pdf structure."""
import re, sys, io
from pathlib import Path
from pypdf import PdfReader

# Force UTF-8 output to avoid Windows cp950 encoding errors
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "source.pdf"
OUT_FILE = ROOT / "data" / "inspect_output.txt"

KEYWORDS = re.compile(r"\b(ID|Question|Answer|Choice|Correct|Rationale|Domain|Skill|Difficulty)\b", re.I)

def main():
    reader = PdfReader(str(SRC))
    n = len(reader.pages)

    lines_out = []
    lines_out.append(f"=== PDF has {n} pages ===\n")

    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        lines_out.append(f"--- Page {i+1} (chars={len(text)}) ---")
        lines_out.append(repr(text[:400]))
        lines_out.append("")
        kw_lines = [ln for ln in text.splitlines() if KEYWORDS.search(ln)]
        if kw_lines:
            lines_out.append("  [keyword lines]")
            for ln in kw_lines[:15]:
                lines_out.append("  | " + repr(ln))
        lines_out.append("")

    output = "\n".join(lines_out)
    OUT_FILE.write_text(output, encoding="utf-8")
    print(f"Wrote inspection to {OUT_FILE}")
    # Also print first 200 lines to stdout
    for ln in lines_out[:200]:
        print(ln)

if __name__ == "__main__":
    main()
