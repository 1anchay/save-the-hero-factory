# Save the Hero Factory 🧡🌋

New standalone cartoon mini-story video factory. **Not a copy of the four-picture quiz project.**

## Status — Stage 1: Foundation

A complete Remotion/React project scaffold and a playable **technical cartoon preview** of one lava-bridge rescue. This preview uses authored vector layers and placeholders for final character art. **Original procedural music and SFX are now included, but no voice track is included yet**; the storyline and caption strings are already provided and Stage 4 will align recorded voice and captions. Do not publish the technical preview as a finished episode.

## Video format

- 1080 × 1920 / 30 fps / H.264 MP4.
- Six-stage narrative: `intro → danger → choicesIntro → decision → outcome → outro`.
- The three choices are revealed **before** the timer starts.
- Six **full seconds** for decision-making (configured per episode; validator rejects less).
- All narrative and on-screen caption strings are in JSON.
- No API keys and no paid cloud services required for the foundation.

## Run locally

Requires Node 20+.

```bash
npm install
npm run check
npm run studio
npm run render:preview
npm run render:demo
```

Preview output: `output/episode-001-preview.mp4`. Full-size output: `output/episode-001.mp4`.

*Note:* First install needs internet. The source package includes no vendor dependencies or binaries. `npm install` will generate `package-lock.json` for reproducibility — commit that file as the next build hygiene improvement.

## Repository branches

- `main`: starter branch, remains unchanged during development.
- `v0/foundation`: the working branch for the animation foundation.
- Do not merge until preview and voice have been reviewed.

## Structure

```text
episodes/episode-001.json  # all content, choices, narration
src/engine/timeline.ts     # timing, six-second guaranteed decision
src/components/            # vector hero, cartoon world, options, captions, timer
src/scenes/                # narrative scene rendering
src/video.tsx              # composition / segment assembly
src/root.tsx               # Remotion composition registration
scripts/validate.mjs       # standalone episode check
tests/                     # timing / decision unit tests
.github/workflows/ci.yml   # validate + typecheck + render preview
```

## Copyright-aware original audio

Music and three SFX are synthesised locally from original code in `scripts/generate-original-audio.mjs`. The project does not download third-party music, reuse samples, or depend on streaming licensing. Run `npm run audio:generate` or either render command to create the WAV files. The audio is author-created and offered for the user's own videos. **TikTok may still incorrectly flag original audio** and its automated decisions cannot be guaranteed; retain the source project, composition notes and rendered stems if an appeal is needed.

## Why voice isn't a placeholder MP3

Stage 1 deliberately validates captions and leaves `audio.voice = null` instead of producing misleading robotic filler. Stage 4 will generate one Russian narration track (using a free TTS provider by default), align caption words using provider timings where available, and fail loudly rather than export a silently voiced final video.

## Planned development

See [docs/ROADMAP.md](docs/ROADMAP.md).

## Stage 4 voice and timed Russian subtitles

The demo now generates six **real spoken Russian** segments with Edge TTS (Dmitry) during GitHub Actions builds. It saves per-word timestamps to `src/generated/voice-timings.json`. The Remotion subtitle layer highlights words at their actual narration timestamps, while the original in-project musical score ducks under speech.

Windows local setup: `python -m pip install 'edge-tts>=7,<8'`, ensure FFmpeg/FFprobe are on PATH, then `npm run render:preview`. A missing speech provider or silent/overlong voice **fails the build**; there is no silent publishing fallback. Edge TTS is an online service even though no API key is required, so its availability and terms may change. Music and SFX remain wholly original and generated locally.

The ending adds a friendly cartoon dragon who arrives too late, as a gag after Max is rescued.
