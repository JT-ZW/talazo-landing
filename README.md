# Talazo Agritech

Farmer-focused public website built with Svelte 5, SvelteKit, and the Vercel deployment adapter. All current pages are prerendered.

## Local development

```sh
npm install
npm run dev
```

On Windows PowerShell with restricted execution policies, use `npm.cmd` instead of `npm`.

## Verification and production

```sh
npm run check
npm run build
npm run preview
```

Vercel deployment output is generated in `.vercel/output/`. See [DEPLOYMENT.md](DEPLOYMENT.md) for replacing the existing website using the same repository, Vercel project, and domain.

## Pages

- `/` — homepage and links into the site
- `/our-approach` — farmer-first monitoring approach
- `/how-it-works` — monitoring steps and frequently asked questions
- `/our-purpose` — mission and sustainability objectives
- `/about` — organisation, values, and Team section (`#team`)
- `/join-pilot` — direct email, call, and WhatsApp contact options

Navigation and footer are shared through the root layout. A sticky header contains the primary navigation, with a menu toggle on narrow screens. The header uses a trimmed version of the supplied logo to remove transparent padding. The Team section uses supplied portraits of Jeffrey-Takunda Murungweni (Product Development Lead) and Alexandra Mwondoka (Operations).

## Editorial imagery

Locally hosted Unsplash photographs support the visual themes of crop care, soil, and harvests. These represent agricultural themes, not Talazo installations or verified sustainability outcomes. Source image IDs:

- Landscape: `photo-1500382017468-9049fed747ef`
- Harvest / produce: `photo-1464226184884-fa280b87c399`
- Soil / tools: `photo-1416879595882-3373a0480b5b`
- Maize: `photo-1625246333195-78d9c38ad449`

Original URLs use `https://images.unsplash.com/<image-id>`. Team portraits were supplied in the project root and copied into `static/images/`.

## Before public launch

- Pilot enquiries currently use `mailto:jeffmuruh@gmail.com`, `tel:+263786303048`, and `https://wa.me/263786303048`. The website does not collect or store form submissions.
- If adding a contact form later, connect a real submission backend and establish a privacy notice, retention rules, and enquiry owner.
- Confirm that product descriptions match the equipment and planned pilot.
- Replace representative landscape photography with permission-cleared African farm photography when available. The current Unsplash image is illustrative, not a Talazo installation.

## Design direction

Talazo's supplied logo anchors a forest-green, cream, leaf-green, and sunrise-yellow palette. The homepage follows a farmer's journey from understanding the proposition to exploring the monitoring approach and expressing pilot interest. No measured impact, testimonials, existing deployments, or live product readings are claimed.

References reviewed: https://www.greenpeace.org.uk/, https://www.fauna-flora.org/, https://bevisioneers.world/. Their content and brand assets are not reproduced.

Photo: https://unsplash.com/photos/green-grass-field-near-trees-under-white-clouds-nesUgwNX3u4 (image delivered via images.unsplash.com/photo-1500382017468-9049fed747ef).
