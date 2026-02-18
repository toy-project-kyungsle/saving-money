# Security Rules

All code in this project MUST follow these security requirements.

## Supabase Key Management

- **NEVER** use `NEXT_PUBLIC_` prefix for `service_role` key or any secret
- **NEVER** use `runtimeConfig.public` for `service_role` key or any secret
- Client-side code may only use the `anon` key (safe, restricted by RLS)
- `service_role` key is allowed only in API routes, server actions, or Edge Functions
- If a new Supabase client is created, verify it uses the correct key for its context

## Row Level Security (RLS)

- Every new table MUST have RLS enabled immediately after creation
- Every table MUST have policies for all CRUD operations (SELECT, INSERT, UPDATE, DELETE)
- Policies MUST use `auth.uid() = user_id` (not hardcoded IDs or `USING (true)`)
- Client-side queries SHOULD include `.eq("user_id", user.id)` as defense-in-depth
- JOIN queries must ensure RLS is enabled on ALL joined tables

## Authentication

- All API routes (`app/api/`) MUST verify session before processing requests
- All server actions (`"use server"`) MUST verify session before database operations
- Pages with user data MUST check `isAuthenticated` before rendering
- Auth state changes must be handled via `onAuthStateChange` for multi-tab sync
- Turnstile CAPTCHA is required for signup and signin flows

## Input Validation

- Validate ALL user inputs on the client side using `src/lib/validation.ts`
- Never trust client input on the server - RLS and column constraints are the real guards
- Use `escapeHtml()` for any text that might be rendered outside React/Vue auto-escaping
- Never use `dangerouslySetInnerHTML` (React) or `v-html` (Vue) with user content
- Never use string interpolation in database queries - use parameterized queries only

## Environment Variables

- `.env`, `.env.local`, and all `.env.*` files MUST be in `.gitignore`
- Never commit real credentials, even "temporarily"
- Only these variables are safe as `NEXT_PUBLIC_`:
  - `NEXT_PUBLIC_SUPABASE_URL` (public project URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public anon key, restricted by RLS)
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public CAPTCHA site key)

## Security Headers

- CSP header should be configured in `next.config.ts` (or `nuxt.config.ts`)
- `X-Frame-Options: DENY` to prevent clickjacking
- `X-Content-Type-Options: nosniff` to prevent MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- HSTS with `max-age >= 63072000`

## Dependencies

- Run `npm audit` before deployments
- Critical or High CVEs in production dependencies must be fixed before deploy
- Avoid adding unnecessary dependencies that increase attack surface

## Error Handling

- Never expose stack traces or internal error details to the client
- Use user-friendly Korean error messages (see `ux-guidelines.md`)
- Never log sensitive data (passwords, tokens, full user records) to console
- Error boundaries should catch and display safe fallback UI

## CORS

- Never use `Access-Control-Allow-Origin: *` in production
- Allowed origins must be explicit and exact-match

## Checklist for New Features

Before marking any feature as complete, verify:

- [ ] No secrets exposed to client-side code
- [ ] All database queries filter by `user_id` (client-side defense-in-depth)
- [ ] Any new table has RLS enabled with per-operation policies
- [ ] All user inputs are validated
- [ ] API routes / server actions check authentication
- [ ] No `dangerouslySetInnerHTML` or `v-html` with user content
- [ ] Error messages don't leak internal details
