# Birthday Invitation

A responsive, static birthday invitation built with semantic HTML, CSS, and vanilla JavaScript. No framework, build step, analytics, RSVP form, guest registration, or RSVP-related storage is used.

## Run locally

Requires Node.js 18 or newer. No package installation or build step is needed.

```powershell
node .\serve.mjs
```

Open <http://127.0.0.1:4173>. To use a different port, set `PORT` before starting the server, for example `$env:PORT = 5000; node .\serve.mjs`.

## Personalize the invitation

Edit the single configuration object in [js/config.js](js/config.js):

- `person`: display name, biography, optional birth date, occupation, interests, portrait, and social profile. Leave unknown personal details blank.
- `celebration`: event date (`YYYY-MM-DD`), local 24-hour time (`HH:MM`), and annual-repeat behavior.
- `events`: add, remove, or edit the schedule cards.
- `venue`: venue name, full address, map search query, directions URL, and contact note.
- `gallery`: photo URL, descriptive alt text, and caption for each item.
- `music`: local audio file path for the birthday song.
- `theme`: the main theme colors (also reflected in CSS custom properties).

The countdown and displayed event times use the visitor's local browser timezone. To use a fixed timezone for attendees in multiple regions, agree on that timezone and include it in the invitation details; the current implementation intentionally avoids silently converting the configured time.

### Photos

The Memories section shows `assets/images/Divya1.jpeg` through `assets/images/Divya71.jpeg` in a 3D glass slideshow. Use the arrow controls or swipe on touch screens; the slideshow advances automatically. Images are lazy-loaded.

### Music

The birthday song at `assets/music/birthday-song.mpeg` starts playing automatically when the page opens. The compact floating music button pauses or resumes playback. Browser autoplay policies may require a visitor to interact with the page first. Update `music` in `js/config.js` to choose another local audio file.

### Venue

Set `venue.mapQuery` to a searchable venue name/address and `venue.directionsUrl` to a Google Maps directions URL. The embed and directions action are populated from these settings.

## Files

- `index.html` — semantic page sections, SEO metadata, navigation, and accessible controls.
- `css/style.css` — theme, glass surfaces, layout, and component styling.
- `css/responsive.css` — mobile, tablet, and compact-screen layouts.
- `css/animations.css` — entrance, floating, and reduced-motion behavior.
- `js/config.js` — all invitation content and editable settings.
- `js/main.js` — configuration rendering and app startup.
- `js/countdown.js` — annual or one-time countdown.
- `js/gallery.js` — 3D slideshow controls, visible-section auto-advance, swipe, and keyboard/touch lightbox.
- `js/interactions.js` — navigation, reveal, invitation-opening, and desktop tilt.
- `js/music.js` — automatic audio playback, floating play/pause control, and browser autoplay fallback.
- `serve.mjs` — dependency-free local static server.

The site is ready for static hosting. No RSVP, attendance confirmation, registration, or response collection is included.
