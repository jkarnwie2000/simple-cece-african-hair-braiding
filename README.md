# Cece African Hair Braiding — Website

A premium, fully responsive multi-page website for **Cece African Hair Braiding**, an African-owned hair braiding salon. It is built with plain **HTML5, CSS3 and vanilla JavaScript (ES6+)**. There is no framework and no build step.

---

## Features

| Area | What's included |
| --- | --- |
| **Design** | Luxury, culturally inspired look: Cormorant Garamond serif headings, Jost body text, a chocolate/beige/champagne-gold palette, arched image frames, and a mud-cloth-inspired zig-zag motif |
| **Pages** | Home, About Us, Services, Gallery, Book Appointment, Contact, Photo Credits |
| **Navigation** | Sticky header, full-screen mobile menu (focus-trapped, closes on Escape), active-page indicator, skip link |
| **Home** | Hero, "Why Choose Us" cards, featured services, about teaser, gallery mosaic with lightbox, testimonials clearly labelled as samples, call-to-action band |
| **Services** | 18 services in 5 categories, rendered from one data file; sticky category bar with scroll-spy; expandable "Details"; every card links to the booking form with the style pre-selected |
| **Gallery** | Category filters (Knotless, Box Braids, Cornrows, Twists, Other), shareable filter URLs (`gallery.html#cornrows`), accessible lightbox with keyboard arrows, swipe and Escape |
| **Booking** | Appointment **request** form. Validates name, email and phone, blocks past dates (and past times today), has a hair-length dropdown, notes with a character counter, and a required "this is a request" acknowledgement. Ends on a confirmation screen with a request summary |
| **Contact** | Contact cards (phone, email, address, hours), a call button, social links, a validated contact form, and a Google Maps embed slot |
| **Extras** | Scroll-reveal animations, back-to-top button, toasts, `prefers-reduced-motion` support, print styles |
| **SEO** | Unique titles and meta descriptions, Open Graph tags, semantic landmarks, one `<h1>` per page, descriptive alt text, responsive WebP images with `srcset`, lazy loading |

### Honesty by design
- **No invented facts.** Prices and durations show *"Price on consultation"* and *"Duration to be confirmed"* until you add real values. The salon's phone, email, address and hours show *"coming soon"* placeholders.
- **Testimonials** carry a visible **Sample** label, plus a notice saying they are not genuine reviews. Both disappear automatically once you replace them with real reviews.
- **Bookings are never presented as confirmed.** The form sends a *request*, and the confirmation screen states that the salon will follow up.
- **Buttons always work.** If no phone number is set, the "Call" buttons switch to "Send a Message" and link to the contact form.
- **Setup notices.** Dashed notes on the site point you to anything that still needs configuring. Turn them off with `showSetupNotices: false` in `js/config.js`.

---

## Technology stack
- HTML5, CSS3 (custom properties, Grid, Flexbox, mobile-first media queries)
- Vanilla JavaScript (ES6+, no modules required, so it also works from `file://`)
- [Font Awesome 6.5.2](https://fontawesome.com/) icons and [Google Fonts](https://fonts.google.com/), both loaded from a CDN (internet connection required)
- No build tools and no npm dependencies

---

## Folder structure

```
simple-cece-african-hair-store/
├── index.html            Home
├── about.html            About Us
├── services.html         Services (cards rendered from js/data.js)
├── gallery.html          Gallery (filters + lightbox)
├── booking.html          Appointment request form
├── contact.html          Contact details, form, map
├── credits.html          Photo attribution (required by the image licenses)
├── robots.txt
│
├── css/
│   ├── style.css         Design tokens, base styles, all components (mobile-first)
│   └── responsive.css    Tablet / laptop / desktop breakpoints, print
│
├── js/
│   ├── config.js         ★ Salon details + form submission settings (edit me)
│   ├── data.js           ★ Services, prices, gallery photos, testimonials (edit me)
│   ├── main.js           Shared: nav, scrolling, reveal, back-to-top, renderers
│   ├── services.js       Services page rendering + scroll-spy
│   ├── gallery.js        Gallery filters + lightbox
│   ├── forms.js          Shared validation + pluggable submission adapter
│   ├── booking.js        Appointment request form
│   └── contact.js        Contact form + map embed
│
└── assets/
    ├── images/           Photos (name.webp = 1200px, name-sm.webp = 600px)
    └── icons/            logo-mark.svg, favicon.svg
```

---

## Running the site locally

**Option A: VS Code + Live Server (recommended)**
1. Open this folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**.

**Option B: any static server**
```bash
# Python 3
python -m http.server 5500
# then open http://localhost:5500
```

**Option C:** double-click `index.html`. Everything works except features that need a web server (some browsers restrict clipboard access on `file://`).

No installation step is required.

---

## Updating salon information (`js/config.js`)

Everything is in one place: the phone number, email, address, hours, social links and map.

```js
salon: {
  phoneDisplay: "(404) 555-0182",   // what visitors see
  phoneDial: "+14045550182",        // used for tap-to-call
  email: "hello@yoursalon.com",
  address: { street: "123 Main St", city: "Atlanta", region: "GA", postalCode: "30303" },
  hours: [ { day: "Monday", time: "Closed" }, { day: "Tuesday", time: "9:00 AM – 7:00 PM" }, ... ],
  social: { instagram: "https://instagram.com/…", facebook: "https://facebook.com/…", tiktok: "https://tiktok.com/@…" },
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=…"
}
```

- **Google Map:** in Google Maps, search the salon, then choose **Share → Embed a map**. Copy only the URL inside `src="…"` into `mapEmbedUrl`.
- When an address is set, the address becomes a Google Maps link and a **Get Directions** button appears.
- After everything is filled in, set `showSetupNotices: false`.

---

## Updating services, prices and durations (`js/data.js`)

Each service looks like this:

```js
{
  id: "medium-knotless",            // used in booking links (?style=medium-knotless)
  name: "Medium Knotless Braids",
  image: "knotless-medium",         // file name in assets/images (without -sm/.webp)
  alt: "Woman with long burgundy knotless braids",
  description: "…",
  details: ["…", "…"],              // bullet points shown under "Details"
  duration: "",                     // e.g. "5–6 hrs"  → shown as-is
  price: "",                        // e.g. "$180"     → shown as "From $180"
  popular: true                     // show on the home page (max 6)
}
```

- Leave `price` / `duration` as `""` to show "Price on consultation" / "Duration to be confirmed".
- To add a service, copy an object into the right category. It appears automatically on the Services page and in the booking dropdown.
- To add a category, add an entry to `serviceCategories` with `id`, `name`, `intro` and `services`.

### Testimonials
Replace the sample entries in `testimonials` with real reviews (with the client's permission) and set `sample: false`. The "Sample" labels and disclaimer disappear automatically.

---

## Replacing placeholder images

The current photos are **openly licensed images from Wikimedia Commons**, used as stand-ins. Each one is credited on `credits.html`, as its license requires. Replacing them with the salon's own photos is strongly recommended.

Each photo has two files in `assets/images/`:

| File | Size | Used for |
| --- | --- | --- |
| `name.webp` | ~1200px wide | Large screens and the lightbox |
| `name-sm.webp` | ~600px wide | Phones, cards and thumbnails |

**Easiest way:** keep the same file names. Export your photo at 1200px and at 600px wide in WebP format (for example with [squoosh.app](https://squoosh.app), quality about 75) and overwrite both files.

**Adding new photos:** save `my-photo.webp` and `my-photo-sm.webp`, then reference `"my-photo"` in `js/data.js` (`image:`) or in the HTML (`hero`, `about` sections).

- **Gallery:** edit the `gallery` array in `js/data.js`. Set `category` to one of `knotless`, `box-braids`, `cornrows`, `twists` or `other`.
- **Hero image:** in `index.html`, search for `hero-feed-in-braids`.
- **Credits:** once a stock photo is replaced, remove its entry from `credits.html`. If none remain, you can delete the page and its footer link.
- Always write meaningful `alt` text, which matters for accessibility and SEO.

---

## Configuring form submissions

Both forms use a pluggable adapter in `js/forms.js`, configured in `js/config.js` → `booking` and `contact`.

### Mode 1: Email (default, no account needed)
```js
booking: { mode: "email", recipientEmail: "bookings@yoursalon.com" }
```
After validation, visitors see their request summary and a **Send Request by Email** button. It opens their email app with everything pre-filled, addressed to you. If `recipientEmail` is empty, `salon.email` is used.

### Mode 2: Endpoint (form service or your own backend)
```js
booking: { mode: "endpoint", endpoint: "https://formspree.io/f/abcdwxyz" }
```
The form sends a JSON `POST` with all fields plus `_subject`. This works with [Formspree](https://formspree.io), [Getform](https://getform.io), [Basin](https://usebasin.com), or your own API. Requests arrive in your inbox or dashboard, and visitors see a "request sent" confirmation. If the request fails, a friendly error is shown.

### Not configured
If neither an email nor an endpoint is set, the form still validates. It then shows the visitor a copyable summary and tells them plainly that the request was **not** sent. A setup notice reminds you to configure it.

### Integrating a booking system later
Replace or extend `deliver()` in `js/forms.js`. It receives `{ subject, text, payload }`, where `payload` holds the structured request (`fullName`, `email`, `phone`, `hairstyleId`, `preferredDate`, `preferredTime`, `hairLength`, `notes`, …). The form and UI code doesn't need to change. Because no payments are taken on this site, there is no checkout or payment code to remove.

---

## Before going live (checklist)
- [ ] Fill in `js/config.js` (phone, email, address, hours, socials, map) and set `showSetupNotices: false`
- [ ] Add real prices and durations in `js/data.js` (or keep "on consultation")
- [ ] Replace the sample testimonials, or remove the section in `index.html`
- [ ] Replace the About Us placeholder note with the salon's real story (`about.html`)
- [ ] Swap in the salon's own photos and update `credits.html`
- [ ] Configure form submissions (email or endpoint) and send a test request
- [ ] Change the `og:image` tags to absolute URLs (`https://yourdomain.com/assets/images/…`) and add a `<link rel="canonical">` once the domain is known
- [ ] Optionally add a `sitemap.xml` with your domain

---

## Browser support
Current versions of Chrome, Edge, Firefox and Safari (desktop and mobile). Animations respect the visitor's reduced-motion setting.
