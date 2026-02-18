---
name: ux-review
description: UX review framework and heuristics for evaluating user experience in the saving-money Korean fintech app. Includes usability heuristics, user flow patterns, Korean fintech conventions, and evaluation checklists.
---

# UX Review Framework - Saving Money

This is the reference guide for conducting UX reviews on this Korean personal finance application.

## Nielsen's 10 Usability Heuristics — Korean Fintech Adaptation

### 1. Visibility of System Status

The system should always keep users informed about what is going on.

**What to check:**
- Loading spinners appear for any async operation (data fetch, save, delete)
- Success feedback after completing an action (save, delete, update)
- Error messages appear immediately when something fails
- Form validation shows feedback as user types or on submit
- Current filter/view state is visually indicated (active category tab)

**Korean fintech standard:**
- Toss: Skeleton loading → content fade-in
- Banksalad: Toast messages for success/error
- This app: `FeedbackLoading`, `FeedbackError`, `FeedbackEmpty` components

### 2. Match Between System and Real World

Use language and concepts familiar to Korean financial users.

**Correct terminology:**
| Concept | Natural Korean | Avoid |
|---------|---------------|-------|
| Savings | 저축, 적금 | 세이빙 |
| Investment | 투자 | 인베스트먼트 |
| Category | 카테고리 | 범주 (too formal) |
| Total | 총 자산, 전체 | 토탈 |
| Add | 추가 | 생성 (too technical) |
| Delete | 삭제 | 제거 (for UI elements, not data) |
| Edit | 수정 | 편집 (for documents, not records) |
| Salary | 월급 | 급여 (too formal for personal app) |
| Stock | 주식 | 스톡 |
| Crypto | 코인 | 암호화폐 (too formal) |
| Rebalancing | 리밸런싱 | 재조정 (acceptable alternative) |
| Amount | 금액 | 양 (wrong context) |
| Date | 날짜 | 일자 (too formal) |

**Currency formatting:**
- Full display: `1,234,567원` (with comma separators)
- Compact display: `123.4만원` (for large numbers)
- Never: `₩1,234,567` or `KRW 1,234,567`

**Date formatting:**
- Display: `2024년 1월 15일` or `2024.01.15`
- Input: Native date picker (YYYY-MM-DD internally)

### 3. User Control and Freedom

Users need a clear "emergency exit" from unwanted states.

**What to check:**
- All modals can be closed via X button, Escape key, or backdrop click
- Cancel buttons are present on all forms
- Delete operations have confirmation dialogs
- Form data is not lost on accidental modal close (or is explicitly discarded)
- Users can filter/unfilter savings list freely
- Navigation back to dashboard is always available

### 4. Consistency and Standards

Same action = same behavior throughout the app.

**Internal consistency checklist:**
- All modals use `BaseModal` with consistent sizing
- All forms use `BaseInput`/`BaseSelect` with consistent layout
- All buttons use `BaseButton` with consistent variants
- All cards use `BaseCard` with consistent spacing
- Primary action is always on the right side of button groups
- Destructive actions always use `danger` variant
- Category always shows as: color dot + name text

**Korean fintech conventions:**
- Primary action button: filled, bottom of form/modal
- Cancel: left side, secondary or ghost variant
- Currency: right-aligned in lists
- Positive indicators: blue (not green, which is for specific categories)
- Lists: most recent items first (reverse chronological)

### 5. Error Prevention

Design to prevent errors before they occur.

**What to check:**
- Required fields are marked and validated
- Amount fields have `min` validation (prevent 0 or negative)
- Date fields default to today (prevent blank dates)
- Category selection is required (not optional)
- Duplicate entries: warn if same amount + category + date exists
- Delete: confirmation with the item name shown

### 6. Recognition Rather Than Recall

Minimize the user's memory load.

**What to check:**
- Categories show both color indicator AND name (never color alone)
- Form labels are always visible (not just placeholders)
- Current filter state is visually highlighted
- Modal titles clearly state the action (e.g., "새 저축 추가" not just "추가")
- Portfolio table shows both percentage AND amount

### 7. Flexibility and Efficiency of Use

Accelerators for experienced users, simplicity for new users.

**What to check:**
- Can users add savings quickly (minimal required fields)?
- Is the most common category pre-selected?
- Does the amount input accept Korean number formatting?
- Can users edit inline or must they always open a modal?
- Is category filtering fast and responsive?

### 8. Aesthetic and Minimalist Design

Every element should serve a purpose.

**What to check:**
- Dashboard doesn't show too many sections at once
- Cards contain only essential information
- Chart legends are minimal but informative
- Empty states have a clear CTA, not just a message
- No decorative elements that don't aid comprehension

### 9. Help Users Recognize, Diagnose, and Recover from Errors

Error messages should be clear, in plain Korean, and suggest solutions.

**Error message guidelines:**
| Bad | Good |
|-----|------|
| Error 400 | 입력한 정보를 확인해주세요 |
| Network Error | 인터넷 연결을 확인하고 다시 시도해주세요 |
| Failed to save | 저장에 실패했습니다. 다시 시도해주세요 |
| Invalid input | 금액은 1원 이상 입력해주세요 |
| Unauthorized | 로그인이 필요합니다 |

**Recovery patterns:**
- Show retry button for network errors
- Preserve form data on save failures
- Redirect to login on auth errors
- Show inline validation for form errors

### 10. Help and Documentation

The interface should be self-explanatory, with help available when needed.

**What to check:**
- Is the app usable without any onboarding?
- Are complex features (rebalancing) explained inline?
- Do empty states guide the user on what to do next?
- Are percentage calculations explained (target vs actual)?

## User Flow Templates

### Optimal Add Saving Flow
```
Dashboard → Click "+ 새 저축" → Modal opens
→ Select category (dropdown with color indicators)
→ Enter amount (number input, auto-formatted)
→ Date defaults to today (can change)
→ Optional description
→ Click "저장" → Success feedback → Modal closes → List updates
```
**Target: 4 interactions (select, type, optional date change, save)**

### Optimal Category Management Flow
```
Dashboard → Click "카테고리 추가" → Category Manager Modal
→ See existing categories listed
→ Click "추가" for new category
→ Enter name, select type, pick color, set target %
→ Save → Category appears in list
→ Close modal → Dashboard reflects new category
```

### Optimal Portfolio Review Flow
```
Dashboard → Scroll to Portfolio section
→ See target vs actual allocation table
→ Identify categories with large gaps
→ Review rebalancing suggestions
→ Click category row → Edit category target %
→ Or: Go add more savings to under-weighted category
```

## Cognitive Load Benchmarks

### Dashboard Information Density
- **Maximum cards visible without scrolling (mobile)**: 2-3
- **Maximum cards visible without scrolling (desktop)**: 4-5
- **Maximum categories shown at once**: 6-8 (with horizontal scroll for more)
- **Maximum data points per chart**: one per category
- **Maximum columns in portfolio table**: 5 (category, target %, current %, difference, amount)

### Decision Points Per Flow
- **Add saving**: 3-4 decisions (category, amount, date, description)
- **Edit saving**: 1-4 decisions (only change what's needed)
- **Delete saving**: 1 decision (confirm/cancel)
- **Add category**: 3-4 decisions (name, type, color, target %)
- **Review portfolio**: 0 decisions (information consumption only)

## Mobile UX Checklist

### Touch Interaction
- [ ] All buttons meet 44x44px minimum touch target
- [ ] Adequate spacing between interactive elements (gap-2 minimum)
- [ ] Swipe gestures are not required for core functionality
- [ ] Category filter tabs scroll horizontally with momentum
- [ ] Modal forms don't require horizontal scrolling

### Viewport Considerations
- [ ] No horizontal overflow on 375px width
- [ ] Primary action button visible without scrolling in modals
- [ ] Number keyboard shown for amount inputs (`inputMode="numeric"`)
- [ ] Form doesn't jump when virtual keyboard appears
- [ ] Charts are readable at mobile width (responsive sizing)

### Content Priority (Mobile)
1. Total savings amount (most prominent)
2. Quick add button (easily accessible)
3. Recent savings list (scrollable)
4. Category chart (compact)
5. Portfolio analysis (below fold, acceptable)

## Korean UX Writing Guidelines

### Tone of Voice
- **Formal but warm**: 해요체 (polite informal) not 합니다체 (formal)
- **Direct**: Tell users what to do, not what happened
- **Encouraging**: Frame financial tracking positively

### Button Labels
| Action | Label | NOT |
|--------|-------|-----|
| Save new item | 저장 | 확인, OK |
| Update item | 수정 완료 | 저장, 업데이트 |
| Cancel | 취소 | 닫기 (for non-form modals) |
| Delete | 삭제 | 제거 |
| Add new | + 새 저축 | 추가, 새로 만들기 |
| Close (info modal) | 닫기 | 취소 |
| Retry | 다시 시도 | 재시도 |

### Empty State Messages
```
No savings yet:     "아직 저축 내역이 없어요. 첫 저축을 추가해보세요!"
No categories:      "카테고리를 추가하면 저축을 분류할 수 있어요."
No investments:     "투자 카테고리를 추가하고 포트폴리오를 관리해보세요."
Filter no results:  "이 카테고리에는 아직 저축 내역이 없어요."
```

### Error Messages
```
Network error:      "인터넷 연결을 확인하고 다시 시도해주세요."
Save failed:        "저장에 실패했어요. 다시 시도해주세요."
Delete failed:      "삭제에 실패했어요. 다시 시도해주세요."
Login required:     "로그인이 필요해요."
Invalid amount:     "금액은 1원 이상 입력해주세요."
Required field:     "필수 항목이에요."
```

## Competitive Reference: Korean Fintech Apps

### Toss (토스)
- Ultra-clean single-column layout
- Large typography for financial amounts
- Bottom sheet modals instead of center modals
- Skeleton loading for every section
- Micro-animations for state changes

### Banksalad (뱅크샐러드)
- Card-based dashboard layout
- Category breakdown with donut charts
- Swipe-to-delete on mobile
- Pull-to-refresh for data updates
- Budget progress bars

### Kakaobank (카카오뱅크)
- Simple, focused interface
- Yellow accent color system
- Bottom navigation bar
- Transaction history with search/filter
- Large touch targets, generous spacing

### What to Adopt
- Clean, minimal layouts (all three)
- Category-based color coding (Banksalad)
- Progressive disclosure of financial details (Toss)
- Clear empty states with CTAs (Kakaobank)
- Consistent Korean terminology (all three)

### What to Avoid
- Complex multi-level navigation (this app is simpler)
- Gamification elements (inappropriate for personal finance tracking)
- Social features (not relevant)
- Excessive animations (distract from financial data)
