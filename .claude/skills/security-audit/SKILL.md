---
name: security-audit
description: Security audit framework for Supabase + Next.js + Nuxt.js web applications. Includes vulnerability checklists, RLS verification queries, secret exposure detection patterns, OWASP Top 10 coverage, and fix templates with code examples.
---

# Security Audit Reference

Comprehensive security audit framework for web applications built on Supabase + Next.js / Nuxt.js.

## Severity Classification

| Level | Definition | Response |
|-------|-----------|----------|
| **Critical** | Active exploit risk, data exposure, secret leak | Immediate fix required |
| **High** | Missing auth/authz, RLS gaps, SSRF vectors | Fix before next deploy |
| **Medium** | Missing headers, weak config, info leakage | Fix within current sprint |
| **Low** | Best practice deviation, minor hardening | Schedule for improvement |
| **Info** | Observations, recommendations | Document for awareness |

## Report Format

```
## Security Audit Report

### Executive Summary
[1-2 sentence overview of security posture]

### Findings

#### CRITICAL
- **[Finding Title]** — `file/path:line`
  - Risk: [What can go wrong]
  - Evidence: [Code snippet or config showing the issue]
  - Fix: [Concrete remediation with code/config diff]

#### HIGH
- ...

#### MEDIUM
- ...

#### LOW
- ...

### Supabase Security Score
- [ ] RLS enabled on all tables
- [ ] No service_role key in client code
- [ ] Auth settings hardened
- [ ] Storage buckets correctly scoped

### Next.js / Nuxt Security Score
- [ ] No secrets in client bundles
- [ ] Security headers configured
- [ ] API routes authenticated
- [ ] CSP policy defined

### Dependency Health
- [ ] No critical CVEs in dependencies
- [ ] Dependencies up to date

### Recommendations Priority
1. [Highest impact fix first]
2. ...
```

---

## 1. Supabase Security Audit

### 1.1 Row Level Security (RLS)

**Why Critical**: Supabase disables RLS by default on new tables. Without RLS, any authenticated user (or anon key holder) can read/write ALL rows.

**Audit Checklist**:
- [ ] RLS is ENABLED on every table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] Every table has SELECT/INSERT/UPDATE/DELETE policies
- [ ] Policies use `auth.uid() = user_id` (not hardcoded IDs)
- [ ] No policy uses `TO public` without restrictions
- [ ] JOIN tables have policies on both sides
- [ ] No `USING (true)` policies in production (allows all access)

**Verification SQL** (run in Supabase SQL Editor):

```sql
-- List all tables and their RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Tables WITHOUT RLS enabled (CRITICAL if any found)
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;

-- List all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Tables with RLS enabled but NO policies (effectively blocks all access)
SELECT t.tablename
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public' AND t.rowsecurity = true
GROUP BY t.tablename
HAVING COUNT(p.policyname) = 0;

-- Check for overly permissive policies (USING true)
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND qual = 'true';
```

**Expected RLS Pattern**:
```sql
-- Per-table, per-operation policies
CREATE POLICY "Users can only see own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert own data"
  ON table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update own data"
  ON table_name FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete own data"
  ON table_name FOR DELETE
  USING (auth.uid() = user_id);
```

**Common RLS Mistakes**:

| Mistake | Risk | Fix |
|---------|------|-----|
| `USING (true)` on SELECT | All users see all data | `USING (auth.uid() = user_id)` |
| Missing UPDATE WITH CHECK | User can change `user_id` to hijack rows | Add `WITH CHECK (auth.uid() = user_id)` |
| RLS on parent but not child table | Data leak through JOINs | Enable RLS on ALL related tables |
| No policy on DELETE | Default deny (safe but may break app) | Add explicit DELETE policy |
| Using `role = 'authenticated'` only | Any logged-in user sees all | Also check `user_id` |

### 1.2 API Key Security

**Key Types**:

| Key | Scope | Safe for Client? | Bypasses RLS? |
|-----|-------|-------------------|---------------|
| `anon` key | Public, restricted by RLS | Yes | No |
| `service_role` key | Admin, full DB access | **NEVER** | **Yes** |

**Detection Patterns** (CRITICAL if found):

```
# service_role key in client-side code
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY    # Next.js client exposure
NEXT_PUBLIC_.*SERVICE.*KEY               # Any service key as NEXT_PUBLIC_
runtimeConfig.public.*service            # Nuxt public runtime config
process.env.NEXT_PUBLIC_.*SERVICE        # Next.js env pattern

# service_role key in any client-accessible location
createClient(url, serviceRoleKey)        # In "use client" components
supabaseAdmin                            # Admin client in client bundle
```

**Safe Pattern**:
```typescript
// Client-side: ONLY anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // anon key = safe
);

// Server-side only (API routes, Edge Functions): service_role OK
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // No NEXT_PUBLIC_ prefix
);
```

**Grep Patterns for Detection**:
```
# Search for service_role key exposure
grep -r "service_role" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.vue"
grep -r "NEXT_PUBLIC.*SERVICE" --include="*.ts" --include="*.env*"
grep -r "SUPABASE_SERVICE_ROLE" --include="*.ts" --include="*.tsx"
grep -r "runtimeConfig.public.*service" --include="*.ts" --include="*.vue"
```

### 1.3 Auth Configuration

**Audit Checklist**:
- [ ] Email confirmation required for signup
- [ ] Password minimum length >= 8 (Supabase Dashboard > Auth > Policies)
- [ ] Rate limiting enabled on auth endpoints
- [ ] JWT expiry is reasonable (default 3600s, recommend <= 3600s)
- [ ] Refresh token rotation enabled
- [ ] MFA available for sensitive operations (if applicable)
- [ ] OAuth redirect URIs are exact-match (no wildcards)
- [ ] Turnstile/CAPTCHA enabled for signup/signin
- [ ] No auto-confirm in production

**Auth Config Locations**:
- Supabase Dashboard > Auth > Settings
- Supabase Dashboard > Auth > Providers
- Supabase Dashboard > Auth > Rate Limits
- Code: `supabase.auth.signUp()` options
- Code: `supabase.auth.signInWithPassword()` options

### 1.4 Storage Bucket Security

**Audit Checklist**:
- [ ] No public buckets unless explicitly required
- [ ] Storage policies use `auth.uid()` for access control
- [ ] File size limits configured
- [ ] Allowed MIME types restricted
- [ ] No path traversal in upload file names

**Verification SQL**:
```sql
-- Check storage bucket configurations
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets;

-- Check storage policies
SELECT * FROM pg_policies WHERE schemaname = 'storage';
```

### 1.5 Edge Functions Security

**Audit Checklist**:
- [ ] Secrets stored in Supabase Vault or environment, not hardcoded
- [ ] CORS configured (not `*` in production)
- [ ] Input validation on all parameters
- [ ] Response does not leak internal errors
- [ ] Rate limiting applied
- [ ] No `service_role` key used for user-context operations

**Pattern to Detect**:
```typescript
// BAD: Hardcoded secret in Edge Function
const API_KEY = "sk-1234567890";

// GOOD: From environment
const API_KEY = Deno.env.get("API_KEY");
```

---

## 2. Next.js Security Audit

### 2.1 Environment Variable Exposure

**Rule**: Only variables prefixed with `NEXT_PUBLIC_` are sent to the browser.

**Audit Checklist**:
- [ ] No secrets use `NEXT_PUBLIC_` prefix
- [ ] `next.config.js/ts` `env` block doesn't expose secrets
- [ ] No secrets in `publicRuntimeConfig`
- [ ] `.env.local` is in `.gitignore`
- [ ] No `.env` files committed to git history

**Detection**:
```
# Check next.config for env exposure
grep -n "NEXT_PUBLIC\|env:" next.config.*

# Check for secrets in env block
grep -n "SECRET\|PRIVATE\|PASSWORD\|SERVICE_ROLE" next.config.*

# Check git history for leaked secrets
git log --all --full-history -p -- "*.env*" ".env*"
git log --all --full-history -p -- "next.config.*" | grep -i "secret\|service_role\|password"
```

**Dangerous Pattern in next.config**:
```typescript
// DANGEROUS: Remaps non-public env to NEXT_PUBLIC_
const nextConfig = {
  env: {
    NEXT_PUBLIC_SECRET: process.env.MY_SECRET, // Exposes secret to browser!
  },
};
```

### 2.2 API Route Security (App Router)

**Audit Checklist**:
- [ ] All `app/api/` routes validate authentication
- [ ] No route returns raw database errors
- [ ] CORS configured per-route where needed
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation on all parameters
- [ ] No open redirects

**Authentication Pattern**:
```typescript
// app/api/protected/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... proceed with authenticated request
}
```

### 2.3 Server Actions Security

**Audit Checklist**:
- [ ] All server actions verify authentication
- [ ] No server action accepts `user_id` from client
- [ ] Input validated before database operations
- [ ] No SSRF via user-controlled URLs in `fetch()`

**SSRF Detection**:
```typescript
// DANGEROUS: User-controlled URL in server action
"use server";
export async function fetchData(url: string) {
  const res = await fetch(url); // SSRF risk!
  return res.json();
}

// SAFE: Allowlist or validated URL
"use server";
const ALLOWED_HOSTS = ["api.example.com"];
export async function fetchData(url: string) {
  const parsed = new URL(url);
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    throw new Error("Forbidden");
  }
  const res = await fetch(url);
  return res.json();
}
```

### 2.4 Security Headers (next.config)

**Recommended Headers**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
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
            "font-src 'self'",
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

**Audit Checklist**:
- [ ] CSP header defined (blocks XSS, injection)
- [ ] X-Frame-Options set to DENY or SAMEORIGIN (blocks clickjacking)
- [ ] X-Content-Type-Options: nosniff (blocks MIME sniffing)
- [ ] Referrer-Policy set (prevents referrer leakage)
- [ ] HSTS enabled with reasonable max-age
- [ ] Permissions-Policy restricts unused APIs

### 2.5 next.config Security Settings

**Audit Checklist**:
- [ ] `poweredBy` disabled (removes `X-Powered-By: Next.js` header)
- [ ] `images.domains` restricted to known hosts
- [ ] No wildcard `rewrites` or `redirects`
- [ ] `experimental` features reviewed for security implications

```typescript
// Recommended security settings
const nextConfig: NextConfig = {
  poweredBy: false,
  images: {
    domains: ["your-cdn.com"], // Explicit allowlist
  },
};
```

---

## 3. Nuxt.js Security Audit

### 3.1 Runtime Config Exposure

**Rule**: Only `runtimeConfig.public` is sent to the browser. `runtimeConfig` (non-public) stays server-side.

**Audit Checklist**:
- [ ] No secrets in `runtimeConfig.public`
- [ ] `runtimeConfig.public` only contains public keys (anon keys, site keys)
- [ ] Server-only secrets in top-level `runtimeConfig`
- [ ] No `process.env` access in Vue components for secrets

**Detection**:
```
# Check nuxt.config for secret exposure
grep -n "public:" nuxt.config.*
grep -n "runtimeConfig" nuxt.config.*
grep -n "SECRET\|PRIVATE\|SERVICE_ROLE" nuxt.config.*

# Check for useRuntimeConfig().public misuse in components
grep -rn "useRuntimeConfig" --include="*.vue" --include="*.ts"
```

**Safe Pattern**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Server-only (NOT exposed to client)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    // Client-safe (exposed to browser)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
});
```

### 3.2 Server Route Security

**Audit Checklist**:
- [ ] All `server/api/` routes validate authentication
- [ ] `server/middleware/` includes auth checks where needed
- [ ] No `defineCachedEventHandler` on authenticated routes
- [ ] Input validated via `readBody()` / `getQuery()`
- [ ] No SSRF via user-controlled fetch URLs

### 3.3 Nuxt Security Headers

**Using nuxt-security module** (recommended):
```typescript
// nuxt.config.ts
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
    rateLimiter: { tokensPerInterval: 150, interval: 300000 },
  },
});
```

### 3.4 nuxt.config Security Settings

**Audit Checklist**:
- [ ] `ssr: true` (SSR prevents client-side secret leaks in initial HTML)
- [ ] `devtools` disabled in production
- [ ] No unnecessary `modules` that expand attack surface
- [ ] `routeRules` don't expose internal endpoints
- [ ] `nitro.routeRules` for API rate limiting configured

---

## 4. General Security Audit

### 4.1 OWASP Top 10 Mapping

| OWASP | This Stack | Where to Check |
|-------|-----------|----------------|
| A01 Broken Access Control | RLS policies, API auth middleware | Supabase policies, API routes |
| A02 Cryptographic Failures | JWT config, password hashing | Supabase Auth settings |
| A03 Injection | SQL (RLS), XSS (React/Vue escaping), NoSQL | Supabase queries, component rendering |
| A04 Insecure Design | Missing auth on routes, IDOR | API routes, data access patterns |
| A05 Security Misconfiguration | Headers, CORS, env exposure | next.config, nuxt.config, Supabase |
| A06 Vulnerable Components | npm dependencies | package.json, npm audit |
| A07 Auth Failures | Session management, brute force | Auth config, rate limiting |
| A08 Data Integrity Failures | Unsigned data, missing validation | Input validation, server actions |
| A09 Logging & Monitoring | Missing audit trail | Supabase logs, error tracking |
| A10 SSRF | Server-side fetch with user input | Server actions, API routes, Edge Functions |

### 4.2 Dependency Audit

**Commands**:
```bash
# npm vulnerability scan
npm audit
npm audit --production  # production-only dependencies

# Check for outdated packages
npm outdated

# Alternative: use Snyk or Socket for deeper analysis
npx snyk test
```

**Severity Classification**:
- Critical CVE in production dependency → Critical
- High CVE in production dependency → High
- Any CVE in devDependency → Low (unless affects build output)
- Outdated but no CVE → Info

### 4.3 Git History Secrets

**Detection**:
```bash
# Search for common secret patterns in git history
git log --all -p | grep -iE "(password|secret|api_key|token|private_key)\s*[:=]"

# Search for .env files ever committed
git log --all --full-history --diff-filter=A -- "*.env" ".env*"

# Use specialized tools
# trufflehog git file://./ --only-verified
# gitleaks detect
```

**Common Patterns to Detect**:
```
# API keys and tokens
[A-Za-z0-9]{32,}                     # Generic long strings
sk[-_][A-Za-z0-9]{20,}               # Stripe-style secret keys
eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}  # JWT tokens
ghp_[A-Za-z0-9]{36}                  # GitHub personal access tokens
AKIA[0-9A-Z]{16}                     # AWS access key IDs
```

### 4.4 CORS Configuration

**Audit Checklist**:
- [ ] No `Access-Control-Allow-Origin: *` in production
- [ ] Allowed origins are exact-match (not regex)
- [ ] Credentials mode matches origin restrictions
- [ ] Preflight (OPTIONS) handled correctly

### 4.5 Client-Side Security

**React/Vue Auto-Escaping**:
- React auto-escapes JSX text interpolation (`{variable}`) - safe
- Vue auto-escapes template interpolation (`{{ variable }}`) - safe
- `dangerouslySetInnerHTML` (React) / `v-html` (Vue) bypass escaping - **flag as potential XSS**

**Detection**:
```
# React XSS vectors
grep -rn "dangerouslySetInnerHTML" --include="*.tsx" --include="*.jsx"

# Vue XSS vectors
grep -rn "v-html" --include="*.vue"

# Direct DOM manipulation
grep -rn "innerHTML\|outerHTML\|document\.write" --include="*.ts" --include="*.tsx" --include="*.vue"
```

### 4.6 Input Validation Reference

**Minimum Validations Required**:

| Input Type | Validation | Server Check |
|-----------|-----------|-------------|
| Email | RFC 5322 format, length limit | Supabase Auth handles |
| Password | Min 6+, max 128, no whitespace-only | Supabase Auth handles |
| Amount | Integer, > 0, <= max (10B), type check | RLS + column CHECK |
| Text fields | Length limit, no HTML tags | RLS + application logic |
| Date | YYYY-MM-DD format, reasonable range | Column type constraint |
| Color | #RGB or #RRGGBB hex format | Application logic |
| IDs | Integer, belongs to current user | RLS policy |
| URLs | Allowlist of hosts (if accepting URLs) | Server-side validation |

### 4.7 Session Security

**Audit Checklist**:
- [ ] Session tokens stored securely (httpOnly cookies preferred over localStorage)
- [ ] Token refresh mechanism works correctly
- [ ] Logout clears all session data (client + server)
- [ ] Session fixation prevented (new token on auth state change)
- [ ] Multi-tab session sync works (Supabase `onAuthStateChange`)
- [ ] Global sign-out option available (invalidate all sessions)

---

## 5. Environment-Specific Checks

### Development
- [ ] `.env.local` exists and is gitignored
- [ ] Dev-only debug flags not in production
- [ ] Source maps not served in production

### Staging
- [ ] Uses separate Supabase project from production
- [ ] Staging secrets are different from production
- [ ] No production data in staging

### Production
- [ ] All `NEXT_PUBLIC_` / `public` runtime values are safe to expose
- [ ] Error pages don't leak stack traces
- [ ] Logging doesn't capture sensitive data (passwords, tokens)
- [ ] HTTPS enforced (HSTS)
- [ ] Domain-specific CORS settings

---

## 6. Supabase-Specific Gotchas

### Top 3 Real-World Vulnerabilities

**1. service_role key in client bundle** (Critical)
```
Risk: Full database access bypassing all RLS
Detection: Search for NEXT_PUBLIC_*SERVICE* or service_role in client code
Impact: Complete data breach - any user can read/write/delete all data
```

**2. RLS disabled on table** (Critical)
```
Risk: Any authenticated user (or anon key holder) can access all rows
Detection: Run SQL query for tables where rowsecurity = false
Impact: Data leak, data manipulation across all users
```

**3. anon key performing admin operations** (High)
```
Risk: Client-side code performing privileged operations
Detection: Look for .rpc() calls, admin-level queries without service_role
Pattern: Edge Function or API Route should use service_role for admin ops
Impact: Privilege escalation, unauthorized data access
```

### Supabase Auth Hardening

```sql
-- Check if email confirmation is required
-- (Must be checked in Dashboard > Auth > Settings)

-- Check JWT settings
-- Dashboard > Auth > JWT Configuration
-- Recommended: exp <= 3600 (1 hour)

-- Check rate limits
-- Dashboard > Auth > Rate Limits
-- Recommended: Sign-in: 30/hour, Sign-up: 5/hour, Token: 360/hour
```

---

## 7. Quick Audit Commands

```bash
# === Supabase Keys ===
# Check for service_role key in codebase
grep -rn "service_role\|SERVICE_ROLE" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.vue" --include="*.env*"

# Check NEXT_PUBLIC_ variables for secrets
grep -rn "NEXT_PUBLIC_" --include="*.ts" --include="*.env*" | grep -i "secret\|service\|private\|password"

# === XSS Vectors ===
grep -rn "dangerouslySetInnerHTML\|v-html\|innerHTML" --include="*.tsx" --include="*.jsx" --include="*.vue"

# === Dependency Vulnerabilities ===
npm audit 2>/dev/null || echo "Run npm audit manually"

# === Git History Secrets ===
git log --all --oneline --diff-filter=A -- "*.env" ".env*" 2>/dev/null

# === Security Headers ===
# Check if headers are configured
grep -rn "headers\(\)\|Content-Security-Policy\|X-Frame-Options" next.config.* nuxt.config.* 2>/dev/null

# === Open Endpoints ===
# Find API routes without auth checks
find . -path "*/api/*/route.ts" -o -path "*/server/api/*.ts" 2>/dev/null | head -20
```
