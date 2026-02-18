---
name: security-audit
description: General security audit framework. Severity classification, report format template, OWASP Top 10 mapping, dependency audit, XSS detection, input validation reference, session security, and quick audit commands.
---

# Security Audit Framework

## Severity Classification

| Level | Definition | Response |
|-------|-----------|----------|
| **Critical** | Active exploit risk, data exposure, secret leak | Immediate fix required |
| **High** | Missing auth/authz, RLS gaps, SSRF vectors | Fix before next deploy |
| **Medium** | Missing headers, weak config, info leakage | Fix within current sprint |
| **Low** | Best practice deviation, minor hardening | Schedule for improvement |

## Report Format

```
## Security Audit Report

### Executive Summary
[1-2 sentence overview]

### Findings

#### CRITICAL
- **[Title]** — `file/path:line`
  - Risk: [What can go wrong]
  - Evidence: [Code snippet]
  - Fix: [Concrete remediation with diff]

#### HIGH / MEDIUM / LOW
- ...

### Security Score
- [ ] RLS enabled on all tables
- [ ] No service_role key in client code
- [ ] Security headers configured
- [ ] No critical CVEs in dependencies

### Recommendations Priority
1. [Highest impact fix first]
```

---

## OWASP Top 10 Mapping

| OWASP | This Stack | Where to Check |
|-------|-----------|----------------|
| A01 Broken Access Control | RLS policies, API auth | Supabase policies, API routes |
| A02 Cryptographic Failures | JWT config, password hashing | Supabase Auth settings |
| A03 Injection | SQL (RLS), XSS (React/Vue escaping) | Queries, component rendering |
| A04 Insecure Design | Missing auth on routes, IDOR | API routes, data access |
| A05 Security Misconfiguration | Headers, CORS, env exposure | next.config, Supabase |
| A06 Vulnerable Components | npm dependencies | package.json, npm audit |
| A07 Auth Failures | Session management, brute force | Auth config, rate limiting |
| A08 Data Integrity Failures | Missing validation | Input validation, server actions |
| A09 Logging & Monitoring | Missing audit trail | Supabase logs, error tracking |
| A10 SSRF | Server-side fetch with user input | Server actions, API routes |

---

## Dependency Audit

```bash
npm audit                 # Full scan
npm audit --production    # Production only
npm outdated              # Check for updates
```

- Critical CVE in production dep → Critical
- High CVE in production dep → High
- Any CVE in devDep → Low (unless affects build)

---

## Client-Side XSS Detection

React/Vue auto-escape `{variable}` / `{{ variable }}` - safe.
These bypass escaping - **flag as potential XSS**:

```
grep -rn "dangerouslySetInnerHTML" --include="*.tsx" --include="*.jsx"
grep -rn "v-html" --include="*.vue"
grep -rn "innerHTML\|outerHTML\|document\.write" --include="*.ts" --include="*.tsx"
```

---

## Input Validation Reference

| Input | Validation | Server Guard |
|-------|-----------|-------------|
| Email | RFC 5322, length limit | Supabase Auth |
| Password | Min 6, max 128 | Supabase Auth |
| Amount | Integer, > 0, <= 10B | RLS + CHECK |
| Text | Length limit, no HTML tags | RLS |
| Date | YYYY-MM-DD, reasonable range | Column type |
| Color | #RGB or #RRGGBB | App logic |
| IDs | Integer, belongs to user | RLS policy |
| URLs | Host allowlist | Server validation |

---

## Session Security

- [ ] httpOnly cookies preferred over localStorage
- [ ] Token refresh works correctly
- [ ] Logout clears all data (client + server)
- [ ] Multi-tab sync via `onAuthStateChange`
- [ ] Global sign-out available

---

## Environment Checks

**Dev**: `.env.local` gitignored, no debug flags leaking
**Staging**: Separate Supabase project, different secrets
**Production**: No stack traces, no sensitive logging, HTTPS enforced

---

## Quick Audit Commands

```bash
# Secret exposure
grep -rn "service_role\|SERVICE_ROLE" --include="*.ts" --include="*.tsx" --include="*.env*"
grep -rn "NEXT_PUBLIC_" --include="*.ts" --include="*.env*" | grep -i "secret\|service\|password"

# XSS vectors
grep -rn "dangerouslySetInnerHTML\|v-html\|innerHTML" --include="*.tsx" --include="*.vue"

# Dependencies
npm audit 2>/dev/null

# Git history secrets
git log --all --oneline --diff-filter=A -- "*.env" ".env*" 2>/dev/null

# Security headers
grep -rn "Content-Security-Policy\|X-Frame-Options" next.config.* nuxt.config.* 2>/dev/null

# CORS
grep -rn "Access-Control-Allow-Origin\|cors" --include="*.ts" --include="*.tsx" 2>/dev/null
```
