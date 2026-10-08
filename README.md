# Save the Hero Factory 🧡🌋

New standalone cartoon mini-story video factory. **Not a copy of the four-picture quiz project.**

## Status — Stage 1: Foundation

A complete Remotion/React project scaffold and a playable **technical cartoon preview** of one lava-bridge rescue. This preview uses authored vector layers and placeholders for final character art. **No voice track is included in Stage 1**; the storyline and caption strings are already provided and Stage 4 will align recorded voice and captions. Do not publish the technical preview as a finished episode.

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

## Why voice isn't a placeholder MP3

Stage 1 deliberately validates captions and leaves `audio.voice = null` instead of producing misleading robotic filler. Stage 4 will generate one Russian narration track (using a free TTS provider by default), align caption words using provider timings where available, and fail loudly rather than export a silently voiced final video.

## Planned development

See [docs/ROADMAP.md](docs/ROADMAP.md).
