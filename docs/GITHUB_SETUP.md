# GitHub workflow

The repository is `1anchay/save-the-hero-factory`.

- `main` is intentionally unchanged until the video quality is approved.
- Work happens on `v0/foundation`.
- Pushes to `v0/foundation` run `.github/workflows/ci.yml`.
- The workflow validates episodes, runs 5 unit tests, checks TypeScript and renders a vertical MP4 technical preview.
- Download the MP4 ZIP from the successful workflow run under **Actions > Artifacts**.

## Windows local development

```powershell
git clone --branch v0/foundation https://github.com/1anchay/save-the-hero-factory.git
cd save-the-hero-factory
npm ci
npm run check
npm run studio
```

For a technical preview: `npm run render:preview`.

The current preview is **intentionally silent**. Russian narration and synchronized captions are planned for the voice milestone; a real generated narration track will be required before public release.
