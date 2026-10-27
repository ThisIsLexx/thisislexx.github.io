# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Independent artists (mostly urban genres: trap, reggaetón, RnB) who have songs or demos and are looking for someone to produce, mix or master them. Many self-fund their releases. They arrive comparing producers, usually from Instagram, Spotify or a referral, often on a phone.

## Product Purpose

The site sells LEXX's music-production services (production, mixing, mastering, custom beats) from Guadalajara, México. Success is an artist writing on WhatsApp to ask for a quote; listening to the work, prices and testimonials exist to get them there.

## Positioning

LEXX accompanies the artist from concept to master: involved in the song's story and direction, not only recording it. Urban sound is home ground. Own studio (vocal booth and mixing station) in Guadalajara plus remote work. Packages priced for independent artists.

## Operating Context

No forms: contact is WhatsApp (primary) or email with a prefilled brief (genre, number of songs, deadline, budget). Quote reply promised within 48 h. Payment 50% to book, 50% on delivery. Remote sessions run through shared folders and video calls.

## Capabilities and Constraints

- Astro static site deployed to GitHub Pages from `main` (repo `ThisIsLexx/thisislexx.github.io`).
- Content lives in collections under `src/content/` (servicios, trabajos, testimonios, faq, estudio, galeria) and business data in `src/config.ts`; the owner edits those files, so components must keep reading from them.
- Audio is never hosted in the repo; work is shown through Spotify / YouTube / SoundCloud embeds.
- Spanish (es-MX) only.

## Brand Commitments

- Name: LEXX (also "ProducedByLexx", "ThisIsLexx").
- Established Bauhaus identity in code: red, magenta and blue triad on ink and paper, Clash Display headlines, Jost body, square / circle / triangle marks, sharp corners. The owner chose to keep this world and push it further (2026-10-26).
- Light and dark themes with a manual toggle.
- No numbered section eyebrows; no auto-scrolling logo ticker.

## Evidence on Hand

- Spotify embeds: playlist "Prod. by Lexx", "Problemzzz" (Santiago Romo, mix), "La trilogía de los desamores" (CELG, production + mix).
- Testimonials: CELG and OVAN, with avatars in `public/img/clientes/`.
- Credited artists: CELG, OVAN, GustavoBK, Bleuss.
- Photos: hero studio (`public/img/hero/`), studio and mixing station (`public/img/estudio/`), piano and rest area (`public/img/galeria/`), portrait (`public/img/contacto/retrato.webp`).
- Prices "desde" and delivery times per service in `src/content/servicios/`.
- No release cover art, no extra session photos and no video yet: do not fabricate them.

## Product Principles

- Every section moves the artist one step closer to writing on WhatsApp.
- Proof beats claims: let them hear the work and read real artists before reading promises.
- Clear money and process: prices, revisions and steps stated plainly, no surprises.
- The site must stay editable by the owner through content files, not code.
