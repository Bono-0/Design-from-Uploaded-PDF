# Still Essence

Still Essence is a React/Vite photography portfolio for a Johannesburg studio. The visual implementation is based on the Figma Make export.

## Local setup

Requirements: Node.js 22 and pnpm 10.

```sh
pnpm install
pnpm dev
```

The development server runs on port 8443 by default. Create a `.env` file from `.env.example` before testing enquiries.

## Production build

```sh
pnpm run build
pnpm run preview
```

## Enquiry email setup

The booking form posts to `api/contact.ts`, a Vercel serverless function. It sends email through Resend and never exposes the API key to the browser.

Set these Vercel project environment variables for Production, Preview, and Development as needed:

- `RESEND_API_KEY`: Resend API key.
- `RESEND_FROM_EMAIL`: verified Resend sender, for example `Still Essence <bookings@your-domain>`.
- `CONTACT_TO_EMAIL`: inbox that should receive enquiries.

In Resend, verify the sending domain or sender address used by `RESEND_FROM_EMAIL`.

## Deploy to Vercel

1. Push this folder to a Git provider, or import the folder directly into Vercel.
2. In Vercel, create a new project and select the repository.
3. Keep the detected framework as Vite. Use `pnpm run build` as the build command and `dist` as the output directory.
4. Add the three Resend environment variables above in Project Settings > Environment Variables.
5. Deploy, then submit a real test enquiry from the deployed `/` page.
6. Replace `YOUR_VERCEL_DOMAIN` in `public/sitemap.xml` with the assigned Vercel URL, then redeploy. Add the sitemap URL to Google Search Console when the site is public.

## Still required from the owner

- Confirm the final Vercel URL or custom domain for the sitemap and canonical URL.
- Provide the real Instagram profile URL.
- Approve the privacy policy and terms content or provide existing URLs.
- Add the Resend values in Vercel; do not commit them to this repository.
