# UX Guidelines

All feature work in this project MUST consider these user experience principles.

## Core UX Principles

### Progressive Disclosure
- Show summary information first, details on demand
- Dashboard: total amount → category breakdown → individual entries
- Modals for detailed operations, not new pages
- Avoid showing all data points simultaneously

### Minimal Interaction Cost
- Core tasks (add saving) must complete in 4 or fewer interactions
- Default values for date (today) and optional fields
- Pre-select the most common category when possible
- Inline validation rather than post-submit validation

### Consistent Mental Model
- One pattern per action type: modals for CRUD, tabs for filtering, cards for display
- Same action should work the same way everywhere
- Category always displayed as: color dot + name text
- Primary action on the right, cancel on the left

## Korean Language UX

### Tone
- Use 해요체 (polite informal): "저장했어요", "입력해주세요"
- NOT 합니다체 (formal): "저장되었습니다", "입력하십시오"

### Terminology
- Use natural Korean financial terms: 저축, 투자, 월급, 적금, 주식, 코인
- Avoid English loanwords when natural Korean exists
- Avoid overly formal/technical terms: 급여(→월급), 범주(→카테고리), 제거(→삭제)

### Currency
- Display: `1,234,567원` (comma-separated with 원)
- Compact: `123.4만원` (for large amounts)
- Never use ₩ symbol or KRW prefix

## User Flow Requirements

### Every User Action Must Have
1. **Clear trigger**: Button or link that looks clickable
2. **Immediate feedback**: Loading state, success message, or error
3. **Recovery path**: Cancel button, retry option, or undo capability

### Empty States
- Never show blank screens or empty tables
- Always provide a message explaining why it's empty
- Include a CTA button to resolve the empty state
- Use `FeedbackEmpty` component

### Error States
- Show user-friendly Korean error messages (not technical errors)
- Provide a concrete recovery action (retry button, form correction hint)
- Preserve user input on form submission failures
- Use `FeedbackError` component with retry action

### Loading States
- Show loading indicator for any operation over 200ms
- Use skeleton or spinner, never freeze the UI
- Use `FeedbackLoading` component
- Add `aria-busy="true"` to loading containers

## Information Architecture

### Dashboard Hierarchy (top to bottom)
1. Total savings summary (highest priority)
2. Quick action buttons (add saving, manage categories)
3. Savings list with category filter
4. Category visualization (chart)
5. Portfolio analysis (below fold is acceptable)

### Modal Sizing
- Simple confirmations: `sm`
- Forms (add/edit): `md`
- Complex managers (category manager): `lg`

## Mobile-First Requirements

- Design for 375px width first, then enhance for larger screens
- No horizontal overflow on any screen
- Touch targets: minimum 44x44px
- Amount inputs: use `inputMode="numeric"` to show number keyboard
- Category tabs: horizontally scrollable with momentum
