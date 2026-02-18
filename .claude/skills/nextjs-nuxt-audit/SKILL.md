---
name: nextjs-nuxt-audit
description: Next.js and Nuxt.js security audit reference. Environment variable exposure, API route authentication, security headers (CSP/HSTS), server action SSRF detection, and framework config hardening.
---

# Next.js / Nuxt.js Security Audit

## Next.js: Environment Variable Exposure

Only `NEXT_PUBLIC_` prefixed vars are sent to the browser.

**Checklist**:
- [ ] No secrets use `NEXT_PUBLIC_` prefix
- [ ] `next.config` `env` block doesn't remap secrets to `NEXT_PUBLIC_`
- [ ] `.env.local` is in `.gitignore`
- [ ] No `.env` files in git history

**Dangerous Pattern**:
```typescript
// DANGEROUS: Exposes secret to browser
const nextConfig = {
  env: { NEXT_PUBLIC_SECRET: process.env.MY_SECRET },
};
```

---

## Next.js: API Route Authentication

**Checklist**:
- [ ] All `app/api/` routes validate session
- [ ] No raw database errors returned
- [ ] Input validated on all parameters
- [ ] No open redirects

**Auth Pattern**:
```typescript
// app/api/protected/route.ts
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // proceed...
}
```

---

## Next.js: Server Actions Security

**Checklist**:
- [ ] All server actions verify authentication
- [ ] No server action accepts `user_id` from client
- [ ] No SSRF via user-controlled URLs in `fetch()`

**SSRF Detection**:
```typescript
// DANGEROUS
"use server";
export async function fetchData(url: string) {
  const res = await fetch(url); // SSRF!
}

// SAFE: Allowlist
const ALLOWED_HOSTS = ["api.example.com"];
export async function fetchData(url: string) {
  const parsed = new URL(url);
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) throw new Error("Forbidden");
  const res = await fetch(url);
}
```

---

## Security Headers (Next.js)

**Recommended `next.config.ts`**:
```typescript
const nextConfig: NextConfig = {
  poweredBy: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "0" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",
            "frame-src https://challenges.cloudflare.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    }];
  },
};
```

**Header Checklist**:
- [ ] CSP defined (blocks XSS, injection)
- [ ] X-Frame-Options: DENY (blocks clickjacking)
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy set
- [ ] HSTS with max-age >= 63072000
- [ ] Permissions-Policy restricts unused APIs

---

## Nuxt.js: Runtime Config Exposure

Only `runtimeConfig.public` is sent to the browser.

**Checklist**:
- [ ] No secrets in `runtimeConfig.public`
- [ ] Server-only secrets in top-level `runtimeConfig`
- [ ] No `process.env` for secrets in Vue components

**Safe Pattern**:
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY, // server-only
    public: {
      supabaseUrl: process.env.SUPABASE_URL,       // client-safe
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY, // client-safe
    },
  },
});
```

---

## Nuxt.js: Server Routes & Headers

**Server Route Checklist**:
- [ ] All `server/api/` routes validate auth
- [ ] No `defineCachedEventHandler` on authenticated routes
- [ ] Input validated via `readBody()` / `getQuery()`

**Security Headers** (nuxt-security module):
```typescript
export default defineNuxtConfig({
  modules: ["nuxt-security"],
  security: {
    headers: {
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com"],
        "connect-src": ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
      },
      xFrameOptions: "DENY",
      xContentTypeOptions: "nosniff",
      referrerPolicy: "strict-origin-when-cross-origin",
    },
  },
});
```

**Config Checklist**:
- [ ] `ssr: true` (prevents client-side secret leaks)
- [ ] `devtools` disabled in production
- [ ] `routeRules` don't expose internal endpoints
