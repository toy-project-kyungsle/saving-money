---
name: ux-review
description: UX review framework and heuristics for evaluating user experience in the saving-money Korean fintech app. Includes usability heuristics, user flow patterns, Korean fintech conventions, and evaluation checklists.
---

# UX Review Reference — Saving Money

Detailed reference data for UX evaluations. For core UX principles, see `ux-guidelines.md` rule. For accessibility, see `accessibility.md` rule.

## Nielsen's 10 Heuristics — Detailed Checks

### 1. Visibility of System Status
- Loading spinners for async operations (data fetch, save, delete)
- Success feedback after completing actions
- Error messages appear immediately on failure
- Form validation shows feedback as user types or on submit
- Current filter/view state is visually indicated (active category tab)

### 2. Match Between System and Real World
**Terminology reference:**
| Concept | Use | Avoid |
|---------|-----|-------|
| Savings | 저축, 적금 | 세이빙 |
| Investment | 투자 | 인베스트먼트 |
| Category | 카테고리 | 범주 |
| Total | 총 자산, 전체 | 토탈 |
| Add | 추가 | 생성 |
| Delete | 삭제 | 제거 |
| Edit | 수정 | 편집 |
| Salary | 월급 | 급여 |
| Stock | 주식 | 스톡 |
| Crypto | 코인 | 암호화폐 |
| Rebalancing | 리밸런싱 | 재조정 |
| Amount | 금액 | 양 |
| Date | 날짜 | 일자 |

**Date formatting:**
- Display: `2024년 1월 15일` or `2024.01.15`
- Input: Native date picker (YYYY-MM-DD internally)

### 3. User Control and Freedom
- All modals dismissible via X, Escape, or backdrop click
- Cancel buttons present on all forms
- Delete operations have confirmation dialogs
- Form data preserved or explicitly discarded on modal close
- Navigation back to dashboard always available

### 4. Consistency and Standards
**Internal consistency:**
- All modals use `BaseModal` with consistent sizing
- All forms use `BaseInput`/`BaseSelect`
- All buttons use `BaseButton` with consistent variants
- Destructive actions always use `danger` variant

**Korean fintech conventions:**
- Primary action button: filled, bottom of form/modal
- Cancel: left side, secondary or ghost variant
- Currency: right-aligned in lists
- Positive indicators: blue (not green)
- Lists: most recent first (reverse chronological)

### 5. Error Prevention
- Required fields marked and validated
- Amount fields have `min` validation (prevent 0 or negative)
- Date fields default to today
- Category selection is required
- Duplicate entries: warn if same amount + category + date
- Delete: confirmation with item name shown

### 6. Recognition Rather Than Recall
- Categories show color indicator AND name (never color alone)
- Form labels always visible (not just placeholders)
- Current filter state visually highlighted
- Modal titles clearly state the action (e.g., "새 저축 추가" not "추가")
- Portfolio table shows both percentage AND amount

### 7. Flexibility and Efficiency of Use
- Minimal required fields for adding savings
- Most common category pre-selected
- Amount input accepts Korean number formatting
- Category filtering fast and responsive

### 8. Aesthetic and Minimalist Design
- Dashboard doesn't show too many sections at once
- Cards contain only essential information
- Chart legends minimal but informative
- Empty states have clear CTA, not just message

### 9. Error Recovery
**Message guidelines:**
| Bad | Good |
|-----|------|
| Error 400 | 입력한 정보를 확인해주세요 |
| Network Error | 인터넷 연결을 확인하고 다시 시도해주세요 |
| Failed to save | 저장에 실패했어요. 다시 시도해주세요 |
| Invalid input | 금액은 1원 이상 입력해주세요 |
| Unauthorized | 로그인이 필요해요 |

**Recovery patterns:** retry button for network errors, preserve form data on save failures, redirect to login on auth errors, inline validation for form errors.

### 10. Help and Documentation
- App usable without onboarding
- Complex features (rebalancing) explained inline
- Empty states guide the user on next steps

## User Flow Templates

### Add Saving (Target: 4 interactions)
```
Dashboard → Click "+ 새 저축" → Modal opens
→ Select category → Enter amount → Date defaults to today
→ Click "저장" → Success feedback → Modal closes → List updates
```

### Category Management
```
Dashboard → Click "카테고리 추가" → Category Manager Modal
→ See existing categories → Click "추가" for new
→ Enter name, select type, pick color, set target %
→ Save → Close modal → Dashboard reflects change
```

### Portfolio Review
```
Dashboard → Scroll to Portfolio section
→ See target vs actual allocation table
→ Review rebalancing suggestions
→ Click category row → Edit target %
```

## Cognitive Load Benchmarks

### Decision Points Per Flow
- **Add saving**: 3-4 (category, amount, date, description)
- **Edit saving**: 1-4 (only change what's needed)
- **Delete saving**: 1 (confirm/cancel)
- **Add category**: 3-4 (name, type, color, target %)
- **Review portfolio**: 0 (information consumption only)

### Dashboard Density Limits
- Mobile (no scroll): 2-3 cards | Desktop (no scroll): 4-5 cards
- Category tabs: 6-8 visible, horizontal scroll for more
- Portfolio table: max 5 columns

## Korean UX Writing

### Button Labels
| Action | Use | Avoid |
|--------|-----|-------|
| Save new | 저장 | 확인, OK |
| Update | 수정 완료 | 저장, 업데이트 |
| Cancel | 취소 | 닫기 (for non-form modals) |
| Delete | 삭제 | 제거 |
| Add new | + 새 저축 | 추가, 새로 만들기 |
| Close info | 닫기 | 취소 |
| Retry | 다시 시도 | 재시도 |

### Empty State Messages
```
No savings:      "아직 저축 내역이 없어요. 첫 저축을 추가해보세요!"
No categories:   "카테고리를 추가하면 저축을 분류할 수 있어요."
No investments:  "투자 카테고리를 추가하고 포트폴리오를 관리해보세요."
Filter empty:    "이 카테고리에는 아직 저축 내역이 없어요."
```

### Error Messages
```
Network:         "인터넷 연결을 확인하고 다시 시도해주세요."
Save failed:     "저장에 실패했어요. 다시 시도해주세요."
Delete failed:   "삭제에 실패했어요. 다시 시도해주세요."
Login required:  "로그인이 필요해요."
Invalid amount:  "금액은 1원 이상 입력해주세요."
Required field:  "필수 항목이에요."
```

## Competitive Reference

### Toss
- Ultra-clean single-column layout, large typography for amounts
- Bottom sheet modals, skeleton loading, micro-animations

### Banksalad
- Card-based dashboard, category donut charts
- Swipe-to-delete, pull-to-refresh, budget progress bars

### Kakaobank
- Simple focused interface, yellow accent system
- Bottom navigation, large touch targets, generous spacing

### Patterns to Adopt
- Clean minimal layouts, category color coding, progressive disclosure, clear empty states, consistent Korean terminology

### Patterns to Avoid
- Complex multi-level navigation, gamification, social features, excessive animations
