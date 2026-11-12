# Re.Log — Independent Weekly Transmissions

A Next.js App Router publication website using the approved Re.Log visual direction: editorial serif typography, warm charcoal, parchment tones, restrained olive/phosphor-green interface details, and Oliver's independent terminal.

## Included in this build

- Workspace homepage with latest transmission, Operator's Bulletin, and image-led discovery strip.
- Archive with live search, category filters, sorting, transmission cards, and a piece index linking to anchors inside their original transmissions.
- Operator dossier page with profile, illustrative metrics, timestamped observations, assignments, recent activity and confidential notes.
- Transmission reader with the edition content model, section navigation, collapsible supplementary-files panel, and Oliver's note.
- Global Oliver terminal. Subscription CTAs open the terminal and collect an email plus explicit consent.
- Server-side MailerLite subscription endpoint with unconfirmed/double-opt-in status.
- Responsive layouts for desktop and mobile.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## MailerLite setup

Add the following to `.env.local` and to your Vercel project environment variables:

```env
MAILERLITE_API_TOKEN=your_token_here
MAILERLITE_GROUP_ID=your_group_id_here
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

The API token must remain server-side. The subscription endpoint requests `unconfirmed` status so MailerLite can send the confirmation email. Configure double opt-in in MailerLite and test with an address you control.

Without credentials, the terminal and form still work, but the server responds that the receiver registry is not connected. No subscription is stored locally.

## Content model

The sample edition is in `content/editions.ts`. Replace its sample text with the exact final email transmission content before launch. Each article has a stable `slug`; the archive index links directly to `/transmissions/<edition-slug>#<article-slug>`.

Supplementary resources should be placed in `public/resources/` and assigned real paths in the edition data. Entries with `href: "#"` are deliberately marked pending in the reader and are not presented as downloadable files.

## Deploy

Import the project into Vercel as a Next.js app, set the environment variables above, and deploy. The project uses Next.js 15.5.28, React 19 and TypeScript.

## Important scope notes

- The Operator metrics, assignments, observations and Bulletin entries are illustrative editorial content. Replace them with approved live copy before public launch.
- The supplied email content was not present in the source bundle. The existing sample edition data has been preserved and rendered in the new reader layout; it has not been represented as the final email.
- Oliver's assistant is scripted locally, not an AI model.
- The current content is file-based. A CMS, analytics, automated weekly publishing, and subscriber management dashboard are not included.
- The Oliver terminal design remains independent of the page layout, but the earlier bespoke drag-to-move behavior is not part of this build.


## CMS content model

Pages CMS is configured in `.pages.yml`. Editorial content is stored as Markdown with YAML frontmatter:

- `content/logs/*.md`: weekly editions, identified by unique `issue_number`.
- `content/articles/*.md`: individual editorial pieces, linked using `parent_issue_number`.
- `content/materials/*.md`: supplementary files, linked by article slug or issue number.

The shared content loader in `content/index.ts` assembles published content for the website. Set both a Log and its articles to `published` in Pages CMS for them to appear publicly. `article_slugs` on a Log optionally controls article order.

Typography and identity tokens are maintained in `app/globals.css`. The four-corner phosphor-eye mark is the reusable `components/SignalMark.tsx` component.
