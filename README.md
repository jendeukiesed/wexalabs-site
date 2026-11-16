# wexalabs.com

The live site is the static build at the repo root (`index.html`, `assets/`).
The source code (Vite + React + Tailwind + Motion) is in `source/`.

To update the site:

```
cd source
npm install
npm run build
```

Then copy the contents of `source/dist/` to the repo root, replacing the old `index.html` and `assets/`.
