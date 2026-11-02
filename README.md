# CareLoop

A demo clinic booking app (Next.js) connected to the Relio CRM through its API and webhooks.

- Patients book a visit or ask for support; each request becomes a lead or ticket in the CRM.
- The clinic team sees leads, reads the email conversation, and replies from here (sent by the CRM).
- CRM events arrive by signed webhook and update the screens live.

## Run it

```bash
cp .env.example .env   # fill in the values
npm install
npm run dev            # http://localhost:3100
```

## Environment

| Variable | What it is |
| --- | --- |
| `CRM_BASE_URL` | Where the CRM backend runs, without `/api/v1` |
| `CRM_API_KEY` | CRM API key. Scopes: `leads.create`, `leads.view`, `leads.email`, `contacts.create`, `tickets.create` |
| `CRM_WEBHOOK_SECRET` | Returned once when the webhook is registered in the CRM |
| `CRM_INBOUND_SECRET` | Optional, demo only. Same value as `INBOUND_EMAIL_SECRET` on the CRM |
