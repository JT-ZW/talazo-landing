# Replace the existing Talazo site on Vercel

Use the existing `JT-ZW/talazo-landing` repository and its existing Vercel project. Keep the domain attached to that project. A replacement branch preserves the original website in Git history and permits a preview before production.

## Project settings

- Framework preset: **SvelteKit** (the old project used Next.js).
- Root directory: repository root (`.`).
- Node.js version: **24.x**.
- Install command: `npm ci`.
- Build command: `npm run build`.
- Output directory: framework default; remove any old Next.js output override. Do not set `build` or `.next`.
- No environment variables are required for this website. It uses direct email, phone, and WhatsApp links.

The checked-in `vercel.json` selects SvelteKit and the build commands. The Vercel adapter writes deployment output to `.vercel/output`. All current pages are prerendered.

## Rollout

1. Push `redesign/sveltekit-website` to the existing repository.
2. In the existing Vercel project, confirm the Git repository is `JT-ZW/talazo-landing` and check the settings above. The production branch is normally `main`; confirm this in the project's Git settings.
3. Open the branch's Vercel preview. Check all six pages, mobile navigation, portraits, photos, and the email/phone/WhatsApp destinations. Opening the links is sufficient; no message needs to be sent.
4. Merge the replacement branch into the production branch. The existing Vercel Git integration should build and deploy the replacement to the existing domain.
5. Check the domain after deployment. If production auto-deployment is disabled, deploy the merged commit from the existing Vercel project.

No new domain setup or new Vercel project is needed when the domain already belongs to this project. Domain ownership and project linkage must be confirmed in Vercel; they cannot be inferred from the Git repository alone.

## Previous website compatibility

- `/contact` and `/booking` redirect to `/join-pilot`.
- `/services` redirects to `/our-approach`.
- `/demo` redirects to `/how-it-works`.
- The old `/admin` page and booking API routes are not part of the replacement website.
- Existing `backend/` and `database/` files remain preserved in the repository; the SvelteKit build does not run them. No database changes are performed.

If rollback is needed, use Vercel's previous working deployment or revert the merge commit. Do not force-push or erase repository history.

## Local verification

```sh
npm ci
npm run check
npm run build
```

The current code requires no secret files. Do not commit `.env`, `node_modules`, `.svelte-kit`, or `.vercel`.
