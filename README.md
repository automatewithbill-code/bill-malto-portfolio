# Bill Malto — Cinematic Portfolio

Award-style scroll-driven portfolio: ink black · emerald · warm cream.
Fully self-contained — fonts and libraries (Lenis, GSAP ScrollTrigger) are vendored locally, no CDN needed.

## Run it locally

Any static server works. From this folder:

    python3 -m http.server 8080
    # then open http://localhost:8080

(Or use VS Code "Live Server", `npx serve`, etc. Opening index.html directly via file:// also works,
but a local server is recommended so the videos stream properly.)

## Add your four Seedance clips

Open **`js/config.js`** and paste each final .mp4 URL from Higgsfield:

    videos: {
      heroOrbit: "https://cdn.higgsfield.ai/....mp4",  // Clip 1 — scroll-scrubbed 360° hero
      builder:   "...",                                 // Clip 2 — Three Pillars background
      expert:    "...",                                 // Clip 3 — Work section background
      closer:    "...",                                 // Clip 4 — Finale background
    },

Until a URL is set, that section shows a styled emerald/ink backdrop instead — nothing breaks.
You can also download the .mp4 files into `assets/` and use relative paths like `"assets/hero.mp4"`
(recommended for production so you're not depending on external hosting).

## Everything else you'll want to edit

- **`js/config.js`** — email, booking link, socials, hero stats, chat quick-answers.
- **`index.html`** — service copy, project cards (clearly marked as samples), footer.
- **`css/style.css`** — design tokens at the top (`:root`) control every color and font.

## What's wired up

- Hero orbit clip scrubbed by scroll (pinned ~2.6 screens), with lerp-smoothed seeking
- "BILL MALTO" letter-by-letter intro + letters drift in sync with scroll progress
- Count-up stats strip (IntersectionObserver-triggered)
- Pinned SERVICES section revealing one platform at a time (click rail also works)
- PROJECTS grid with sample case-study cards
- Pinned THREE PILLARS over Clip 2 (AUTOMATE / INTEGRATE / SCALE)
- WORK cards over Clip 3, finale CTA over Clip 4
- Scrolling tool marquees, grain overlay, Lenis smooth scrolling
- Floating "Chat with Bill" widget: quick questions + message → opens the visitor's
  email app addressed to you (no backend required; swap in Crisp/Tawk/etc. later if you like)
- Responsive to mobile; `prefers-reduced-motion` fully respected (no pinning/scrub, static frames)

## Notes

- Project cards and stats use **sample/placeholder data** and are labeled as such on the page —
  replace them with real work before presenting results as real.
- Background clips only play while on screen (battery-friendly); the hero clip is scrubbed, never played.
