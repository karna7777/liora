# Liora Frontend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Make sure Tailwind CSS is properly configured (already done):
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Main CSS file with Tailwind directives

3. Start the development server:
```bash
npm run dev
```

**IMPORTANT:** If styles are not appearing, restart the dev server:
1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again

The dev server should automatically pick up Tailwind CSS changes.

## Troubleshooting

If Tailwind classes are not working:
1. Make sure the dev server is running
2. Check browser console for errors
3. Verify `src/index.css` is imported in `src/main.jsx`
4. Clear browser cache and hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
