# Deploying Your Portfolio

This guide will help you deploy your portfolio to Vercel (recommended) or Render.

**Important:** Before deploying, make sure you have your Supabase **Project URL** and **Anon Key** ready. You can find these in your Supabase Dashboard under Project Settings > API.

---

## Option 1: Vercel (Recommended & Easiest)
Vercel is the creators of Next.js, so it works perfectly out of the box.

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [Vercel.com](https://vercel.com) and sign up/log in using your GitHub account.
3.  Click **"Add New..."** -> **"Project"**.
4.  Select your `social-worker-portfolio` repository and click **"Import"**.
5.  In the "Configure Project" screen, look for **"Environment Variables"**.
6.  Add the following variables (copy them from your `.env.local` or Supabase):
    *   **Key:** `NEXT_PUBLIC_SUPABASE_URL`
        **Value:** `https://your-project-id.supabase.co` (Your actual URL)
    *   **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        **Value:** `eyJh...` (Your actual key)
    *   **Key:** `SUPABASE_SERVICE_ROLE_KEY`
        **Value:** the `service_role` key from Project Settings > API.
        Server-side writes use this key, so the public `anon` key can stay read-only.
        **Never** rename it with a `NEXT_PUBLIC_` prefix — that would expose it to every visitor.
7.  Click **"Deploy"**.

Wait a minute, and your site will be live! Vercel will give you a domain like `social-worker-portfolio.vercel.app`.

### HTTPS and the custom domain

You do not need to buy or upload a separate SSL certificate when this site is deployed on Vercel. Vercel issues and renews a Let's Encrypt certificate automatically after the domain and DNS records are verified.

1. Open the Vercel project and go to **Settings > Domains**.
2. Add both `parkjuim90.cloud` and `www.parkjuim90.cloud`.
3. In Gabia DNS management, enter the exact A/CNAME values shown by Vercel. The values displayed in the Vercel dashboard are authoritative because a project can receive a project-specific record.
4. Set one domain as **Primary** and redirect the other one to it.
5. Wait for the domain status to become **Valid Configuration**, then open the site with `https://`.

Vercel provisions the certificate after DNS propagation, usually within a few minutes. If certificate issuance fails, check for an old `_acme-challenge` TXT record or a CAA record that does not allow `letsencrypt.org`.

---

## Option 2: Render

Render is a great alternative if you prefer it.

1.  Go to [Render.com](https://render.com) and sign up/log in.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  Give it a name (e.g., `my-portfolio`).
5.  Use the following settings:
    *   **Runtime:** Node
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
6.  Scroll down to **"Environment Variables"** section.
7.  Add the variables:
    *   `NEXT_PUBLIC_SUPABASE_URL` = Your URL
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
    *   `SUPABASE_SERVICE_ROLE_KEY` = Your service_role key (server-side only)
8.  Click **"Create Web Service"**.

Render might take a few minutes to build and deploy.

---

## Troubleshooting

*   **Database Connection Failed:**
    *   Make sure you copied the URL and Anon Key correctly without extra spaces.
    *   Ensure your Supabase project is not paused.
*   **Images not loading:**
    *   If you added images locally to `public/`, they should work.
    *   If you are linking to external images, make sure the links are valid.
*   **Photo upload in the admin 기록 section fails:**
    *   The uploader stores files in the Supabase Storage bucket `portfolio-media`. Run the storage section of `supabase_schema.sql` once (Supabase Dashboard > SQL Editor) to create the bucket and its public-read policy.
    *   Uploads are written with `SUPABASE_SERVICE_ROLE_KEY`, so that variable must be set in the deployment environment. Without it the request is rejected by row level security.
    *   Each photo must be a JPG, PNG, WEBP, GIF, or AVIF file of 5MB or less.

## Updating your site
Whenever you push changes to GitHub (`git push`), Vercel or Render will automatically redeploy your site with the updates!
