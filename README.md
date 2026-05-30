# EMBERS IN THE SEA / 海水燃烬

A personal digital artbook website. The deployable version is self-contained in `index.html` and uses local assets from `public/`.

## Run Locally

```bash
npm install
npm run dev
```

Vite will print a local preview URL, usually:

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm run build
npm run preview
```

The production files will be generated in `dist/`.

## File Structure

```text
.
├── index.html
├── package.json
├── public
│   ├── artbook-web    # Optimized preview images for web deployment
│   └── brand
│       └── ma.png     # Homepage / badge visual mark
└── src
    ├── main.jsx       # React components, gallery data, badge physics
    └── styles.css     # Visual system, responsive layout, motion
```

## Editing

- Update homepage text, styling, and interactions in `index.html`.
- Replace or add artbook images in `public/artbook-web`.
- Replace the MA visual in `public/brand/ma.png`.
- The old `src/` files are kept only as source history; the live page is `index.html`.

## Deployment

This project can be deployed to Vercel, Netlify, GitHub Pages, or any static host. Use `npm run build`, then deploy the generated `dist/` folder.
