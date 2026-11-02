# CareLoop

A demo clinic booking app that shows how an outside website can work with the Relio CRM through its API and webhooks. Built with Next.js 15, React 19 and Tailwind v4.

## What it shows

1. **A patient books a visit** or asks for support. The request is created in the CRM as a lead or a ticket.
2. **The CRM emails the lead.** CareLoop shows the whole conversation on the lead's page.
3. **The clinic replies from CareLoop.** The email is sent by the CRM from its connected mailbox and saved on the lead.
4. **The lead's status follows the conversation.** Interested or not, the CRM updates the stage and CareLoop shows it.
5. **CRM events arrive by signed webhook** and refresh the screens, with a "CRM activity" page that shows each payload.

| Page | What it does |
| --- | --- |
| `/book` | Booking form, creates a lead |
| `/support` | Support form, creates a ticket |
| `/leads` | Pipeline overview with filters and search |
| `/leads/[id]` | One lead: stage, email thread, reply form |
| `/events` | Webhook events received from the CRM |

## Requirements

- Node.js 20 or newer
- A running Relio CRM backend and an API key for it

## Getting started

```bash
cp .env.example .env      # fill in the values below
npm install
npm run dev               # http://localhost:3100
```

## Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `CRM_BASE_URL` | yes | Where the CRM backend runs, with no `/api/v1` suffix, for example `https://api.example.com` |
| `CRM_API_KEY` | yes | A CRM API key with the scopes `leads.create`, `leads.view`, `leads.email`, `contacts.create` and `tickets.create` |
| `CRM_WEBHOOK_SECRET` | for the activity feed | Returned once when you register the webhook in the CRM |
| `CRM_INBOUND_SECRET` | optional | Demo only. Same value as `INBOUND_EMAIL_SECRET` on the CRM. Turns on the "Answer as the lead" box, which pretends the lead replied |

The API key and secrets are only used on the server. The browser never sees them.

## Connecting it to the CRM

1. In the CRM, create an API key with the scopes above and put it in `CRM_API_KEY`.
2. Connect a mailbox in the CRM's mail settings, so it can send emails to leads.
3. Register the webhook with `POST /api/v1/webhooks`, using the URL `https://<this app>/api/webhooks/crm`. Copy the secret from the response into `CRM_WEBHOOK_SECRET` and restart.
4. For replies to reach the CRM from real inboxes, the CRM needs your mail provider's incoming mail forwarded to its inbound email endpoint.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3100 |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | Type-check |

## Project layout

```
src/
  app/            Pages and API routes (/api/leads, /api/tickets, /api/webhooks/crm, ...)
  components/     ui (buttons, inputs, tables), common (sidebar, form field, empty states)
  modules/        leads, tickets, webhooks: components, hooks, schemas and services
  lib/            CRM client (lib/crm-sdk), API helpers, rate limiting
  config/         Site info and environment validation
```

The CRM client in `src/lib/crm-sdk` is a small typed wrapper around the CRM API, with the webhook signature check.

## Deploying (Vercel)

1. Import the repo. No build settings are needed.
2. Add the environment variables above.
3. After the first deploy, register the webhook with the deployed URL, add `CRM_WEBHOOK_SECRET`, and redeploy.

## Known limits

- **There is no login.** Anyone who can open the app can book, open tickets and email leads through the CRM, limited to 20 requests a minute. Keep it behind a login or limit access before using it with real data.
- **Events are kept in server memory.** On Vercel's short-lived instances the activity feed can miss events and the live stream can drop. Store events in a database or Redis for a reliable feed. Leads, tickets and emails go straight through the CRM and are not affected.
