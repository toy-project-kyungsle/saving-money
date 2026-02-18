---
name: supabase-audit
description: Supabase security audit reference. RLS verification SQL, API key exposure detection, auth hardening, storage bucket policies, and Edge Function security patterns.
---

# Supabase Security Audit

## Row Level Security (RLS)

Supabase disables RLS by default on new tables. Without RLS, any anon key holder can read/write ALL rows.

**Checklist**:
- [ ] RLS ENABLED on every table
- [ ] SELECT/INSERT/UPDATE/DELETE policies per table
- [ ] Policies use `auth.uid() = user_id` (not hardcoded IDs)
- [ ] No `USING (true)` policies in production
- [ ] JOIN tables have RLS on both sides

**Verification SQL**:
```sql
-- Tables WITHOUT RLS (CRITICAL if any found)
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;

-- All RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- RLS enabled but NO policies (blocks all access)
SELECT t.tablename
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public' AND t.rowsecurity = true
GROUP BY t.tablename
HAVING COUNT(p.policyname) = 0;

-- Overly permissive policies
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND qual = 'true';
```

**Expected Policy Pattern**:
```sql
CREATE POLICY "select_own" ON table_name FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON table_name FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON table_name FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own" ON table_name FOR DELETE USING (auth.uid() = user_id);
```

**Common Mistakes**:

| Mistake | Risk | Fix |
|---------|------|-----|
| `USING (true)` on SELECT | All users see all data | `USING (auth.uid() = user_id)` |
| Missing UPDATE WITH CHECK | User can hijack rows by changing user_id | Add `WITH CHECK` clause |
| RLS on parent but not child | Data leak through JOINs | Enable RLS on ALL related tables |
| `role = 'authenticated'` only | Any logged-in user sees all | Also check `user_id` |

---

## API Key Security

| Key | Safe for Client? | Bypasses RLS? |
|-----|-------------------|---------------|
| `anon` key | Yes | No |
| `service_role` key | **NEVER** | **Yes** |

**Detection Patterns** (CRITICAL if found):
```
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY    # Next.js client exposure
NEXT_PUBLIC_.*SERVICE.*KEY               # Any service key as NEXT_PUBLIC_
runtimeConfig.public.*service            # Nuxt public runtime config
createClient(url, serviceRoleKey)        # In "use client" components
```

**Safe Patterns**:
```typescript
// Client: anon key only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server only (API routes, Edge Functions): service_role OK
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,              // No NEXT_PUBLIC_
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // No NEXT_PUBLIC_
);
```

---

## Auth Hardening

**Checklist**:
- [ ] Email confirmation required for signup
- [ ] Password minimum length >= 8
- [ ] JWT expiry <= 3600s (1 hour)
- [ ] Refresh token rotation enabled
- [ ] Turnstile/CAPTCHA on signup/signin
- [ ] No auto-confirm in production
- [ ] OAuth redirect URIs exact-match (no wildcards)

**Config Locations**: Dashboard > Auth > Settings / Providers / Rate Limits

---

## Storage Bucket Security

**Checklist**:
- [ ] No public buckets unless explicitly required
- [ ] Storage policies use `auth.uid()`
- [ ] File size limits configured
- [ ] Allowed MIME types restricted

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types FROM storage.buckets;
SELECT * FROM pg_policies WHERE schemaname = 'storage';
```

---

## Edge Functions

**Checklist**:
- [ ] Secrets from environment, not hardcoded
- [ ] CORS not `*` in production
- [ ] Input validated
- [ ] No internal error details in responses
- [ ] No `service_role` for user-context operations

---

## Top 3 Real-World Vulnerabilities

**1. service_role key in client bundle** (Critical)
- Impact: Complete data breach, bypasses ALL RLS
- Detection: `NEXT_PUBLIC_*SERVICE*` or `service_role` in client code

**2. RLS disabled on table** (Critical)
- Impact: Any user can read/modify all rows
- Detection: `SELECT tablename FROM pg_tables WHERE rowsecurity = false`

**3. anon key performing admin operations** (High)
- Impact: Privilege escalation
- Detection: `.rpc()` calls or admin queries from client code
- Fix: Move to Edge Functions / API routes with service_role
