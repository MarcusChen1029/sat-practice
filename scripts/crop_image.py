"""Crop a region from a PNG. Called by ingest.ts when a subagent reports visualBbox."""
import sys, json
from pathlib import Path
from PIL import Image

def main():
    args = json.loads(sys.argv[1])
    src = Path(args["src"]); dst = Path(args["dst"])
    bbox = args["bbox"]
    scale = 200.0 / 72.0
    px_bbox = (int(bbox[0] * scale), int(bbox[1] * scale), int(bbox[2] * scale), int(bbox[3] * scale))
    img = Image.open(src)
    img.crop(px_bbox).save(dst)
    print(json.dumps({"ok": True, "dst": str(dst)}))

if __name__ == "__main__":
    main()
