#!/usr/bin/env python3
"""Fail-closed preflight for a fully voiced story video."""
from __future__ import annotations
import json
import math
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHASES = ["intro","danger","choicesIntro","decision","outcome","outro"]
ep = json.loads((ROOT / "episodes/episode-001.json").read_text(encoding="utf-8"))
manifest = json.loads((ROOT / "src/generated/voice-timings.json").read_text(encoding="utf-8"))
assert manifest["id"] == ep["id"], "Wrong voice manifest for episode"
assert set(manifest["phases"]) == set(PHASES), "Missing voiced phase"
assert manifest["voice"].startswith("ru-RU-"), "Expected Russian narrator"

def probe(path: Path) -> dict:
    result=subprocess.run([
        "ffprobe","-v","error","-show_entries",
        "stream=codec_name,codec_type:format=duration",
        "-of","json",str(path)
    ], capture_output=True,text=True,check=True)
    return json.loads(result.stdout)

for phase in PHASES:
    obj=manifest["phases"][phase]
    file=ROOT / "assets" / obj["file"]
    assert file.exists() and file.stat().st_size > 2500, f"Missing recorded narration: {phase}"
    meta=probe(file)
    assert any(s.get("codec_type")=="audio" for s in meta["streams"]), f"No voice codec for {phase}"
    duration=float(meta["format"]["duration"])
    assert 0.3 < duration <= ep[phase]["seconds"]+0.025, f"Narration clips phase {phase}: {duration:.3f}s"
    written=re.findall(r"\S+", ep[phase]["narration"])
    words=obj["words"]
    assert [w["text"] for w in words]==written, f"Subtitle content mismatches narration in {phase}"
    for i,w in enumerate(words):
        assert w["end"] >= w["start"] >= 0, f"Invalid word boundaries in {phase}"
        assert w["end"] <= ep[phase]["seconds"]+.025, f"Word after narration segment in {phase}"
        if i: assert w["start"] >= words[i-1]["start"], f"Out of order timestamps in {phase}"
    print(f"Verified {phase}: {len(words)} spoken words / {duration:.2f}s")

assert ep["decision"]["seconds"] >= 6, "Decision interval too short"
video=ROOT/"output/episode-001-preview.mp4"
assert video.exists(), "No rendered MP4"
meta=probe(video)
assert any(s.get("codec_type")=="video" and s.get("codec_name")=="h264" for s in meta["streams"]), "MP4 lacks H.264 video"
assert any(s.get("codec_type")=="audio" and s.get("codec_name")=="aac" for s in meta["streams"]), "MP4 lacks AAC audio"
target=sum(ep[k]["seconds"] for k in PHASES)
duration=float(meta["format"]["duration"])
assert math.isclose(duration,target,abs_tol=.20), f"MP4 duration {duration} differs from timeline {target}"
report={"status":"PASS","narrated_phases":6,"voice":manifest["voice"],
        "word_boundaries":sum(len(manifest["phases"][p]["words"]) for p in PHASES),
        "choice_seconds":ep["decision"]["seconds"],"video_seconds":duration,
        "codecs":["h264","aac"],"music_source":"in-project original synthesis"}
out=ROOT/"output/voice-validation.json"
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("VOICE, WORD-TIMINGS, FULL SIX-SECOND CHOICE AND FINAL MP4: PASS")
