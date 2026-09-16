# DPS Gasworks Plumbing & Heating — landing page preview

Static one-page preview (HTML/CSS/JS, no build step) for Dav Singh, Gas Safe engineer in Bedford.

Run locally: `python3 -m http.server 8765` and open http://localhost:8765

## Files

- `index.html`: page content and LocalBusiness schema
- `styles.css`: design tokens (`:root`) and layout
- `script.js`: copper-pipe layout/animation (hero, How it works, footer), the menu dropdown below 1080px, mobile call bar and the draft enquiry form
- `assets/logo-mark.svg`: logo mark (also the favicon)
- `assets/img/`: job photos as WebP. All are Dav's own from his MyBuilder profile except the hero.
  - `hero-boiler-pipes.webp` (from `pipes.png`) is the hero image. It is not Dav's photo and looks like stock or AI art, so confirm we have the rights to use it. It is only 600×600, so it looks soft on large and retina screens.
  - `hero-copper-fittings(-sm).webp` and `hero-pipe-connections(-sm).webp` are earlier hero options from Dav's photos, no longer used. `pipework-under-boiler-crop.webp` is a crop of the original (kept alongside).

## Confirm with the client before launch

- Gas Safe registration number (add it to the hero and footer once confirmed)
- Trading name and status: the Ltd company was dissolved in July 2025, so "Ltd" isn't used anywhere
- Area covered (the page only says Bedford; one directory also mentions London)
- Warranty terms (MyBuilder says he offers one, but the terms are unknown)
- Domain: `dpsgasworksplumbingandheating.com` is unregistered, but his Google listing still links to it
- Permission to quote the customer reviews (shown as first name and last initial)
- Review count and rating are hard-coded (4.7 from 23 reviews as of Sept 2026)
- Wording in the "why customers choose Dav" strip and "How it works" (same-day visits, follow-up after the job, looking at the job before pricing)

## Not done yet (after sign-up)

- The enquiry form only validates and shows a "preview" message; nothing is sent. Connect it to email.
- Other pages (individual services, about, contact)
- Replace relative `og:image` with an absolute URL once the domain is live
