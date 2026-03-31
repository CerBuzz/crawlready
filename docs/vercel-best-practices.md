# Vercel Best Practices

Reference for deploying and operating on Vercel. Extracted from project experience.

## Functions

- Treat Vercel Functions as stateless + ephemeral
- Use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated — prefer Vercel Functions
- Set Function regions near your primary data source
- Use `waitUntil` for post-response work

## Storage

- Don't start new projects on Vercel KV/Postgres (both discontinued)
- Use Marketplace Redis/Postgres instead if needed
- Use Vercel Blob for uploads/media
- Use Edge Config for small, globally-read config

## Secrets & Config

- Store secrets in Vercel Env Variables, not in git or `NEXT_PUBLIC_*`

## Scheduling

- Use Cron Jobs for schedules
- Cron runs in UTC and triggers your production URL via HTTP GET

## AI Gateway

- Always `curl https://ai-gateway.vercel.sh/v1/models` first — never trust model IDs from memory
