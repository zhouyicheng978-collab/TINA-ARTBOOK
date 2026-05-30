# EMBERS IN THE SEA / 海水燃烬

A personal digital artbook website built with React + Vite.

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

- Update homepage text and section copy in `src/main.jsx`.
- Replace or add artbook images in `public/artbook-web`.
- Replace the MA visual in `public/brand/ma.png`.
- Tune atmosphere, layout, and motion in `src/styles.css`.

## Deployment

This project can be deployed to Vercel, Netlify, GitHub Pages, or any static host. Use `npm run build`, then deploy the generated `dist/` folder.
