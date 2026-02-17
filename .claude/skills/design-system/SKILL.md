---
name: design-system
description: Design system tokens and component patterns for the saving-money Korean fintech app. Includes colors, typography, spacing, borders, shadows, animations, and reusable component code snippets.
---

# Design System - Saving Money

This is the single source of truth for all design tokens and component patterns in this project.

## Color Tokens

### Category Colors (defined in tailwind.config.ts)

| Category | DEFAULT   | Light     | Dark      | Usage         |
|----------|-----------|-----------|-----------|---------------|
| salary   | `#4CAF50` | `#81C784` | `#388E3C` | 월급 (Green)  |
| savings  | `#2196F3` | `#64B5F6` | `#1976D2` | 적금 (Blue)   |
| stock    | `#FF9800` | `#FFB74D` | `#F57C00` | 주식 (Orange) |
| crypto   | `#9C27B0` | `#BA68C8` | `#7B1FA2` | 코인 (Purple) |

Tailwind usage: `bg-salary`, `text-savings-dark`, `border-stock-light`, etc.

### Neutral Palette (Tailwind gray)

| Token      | Value     | Usage                          |
|------------|-----------|--------------------------------|
| `gray-50`  | `#F9FAFB` | Page background                |
| `gray-100` | `#F3F4F6` | Disabled input background      |
| `gray-200` | `#E5E7EB` | Borders, dividers              |
| `gray-300` | `#D1D5DB` | Input borders (default)        |
| `gray-400` | `#9CA3AF` | Icon default color             |
| `gray-500` | `#6B7280` | Captions, tertiary text        |
| `gray-600` | `#4B5563` | Secondary text, labels         |
| `gray-700` | `#374151` | Ghost button text              |
| `gray-900` | `#111827` | Primary text, headings         |
| `white`    | `#FFFFFF` | Card/modal backgrounds         |

### Semantic Colors

| Purpose     | Class                  | Hex       |
|-------------|------------------------|-----------|
| Primary     | `blue-600`             | `#2563EB` |
| Primary hover | `blue-700`           | `#1D4ED8` |
| Danger      | `red-600`              | `#DC2626` |
| Danger hover | `red-700`             | `#B91C1C` |
| Error text  | `red-500`              | `#EF4444` |
| Focus ring  | `ring-blue-500`        | `#3B82F6` |
| Success     | `green-600` (sparingly)| `#16A34A` |

## Typography

### Font Stack
System fonts only. No explicit font-family declarations needed.
The `<html lang="ko">` tag ensures proper Korean rendering.

### Type Scale

```
Page title:     text-2xl font-bold text-gray-900       (24px, 700)
Section title:  text-lg font-semibold text-gray-900     (18px, 600)
Card title:     text-lg font-semibold text-gray-900     (18px, 600)
Body:           text-base text-gray-900                  (16px, 400)
Label:          text-sm font-medium text-gray-700        (14px, 500)
Secondary:      text-sm text-gray-600                    (14px, 400)
Caption:        text-xs text-gray-500                    (12px, 400)
Logo text:      text-lg font-bold text-gray-900          (18px, 700)

Money (hero):   text-3xl font-bold text-gray-900         (30px, 700)
Money (accent): text-3xl font-bold text-blue-600         (30px, 700)
Money (inline): font-semibold text-gray-900              (inherit, 600)
```

## Spacing

### Page-Level
```
Page padding:     px-4 sm:px-6 lg:px-8
Content max-width: max-w-4xl mx-auto
Vertical rhythm:  py-8 (main content top/bottom)
Section gap:      space-y-6
```

### Card-Level
```
Card padding:     p-4 sm:p-6      (default "md")
Card padding lg:  p-6 sm:p-8
Card internal:    space-y-4
Grid gap:         gap-3 to gap-4
```

### Component-Level
```
Button padding:   px-3 py-1.5 (sm) / px-4 py-2 (md) / px-6 py-3 (lg)
Input padding:    px-4 py-2
Modal header:     px-6 py-4
Modal body:       px-6 py-4
Modal footer:     px-6 py-4
Inline gap:       gap-2 (tight) / gap-4 (normal)
Label margin:     mb-1
Error margin:     mt-1
```

## Border & Shape

```
Cards:            rounded-xl border border-gray-200
Modals:           rounded-xl
Buttons:          rounded-lg
Inputs:           rounded-lg border border-gray-300
Category dots:    rounded-full (w-2 h-2 or w-2.5 h-2.5)
Logo icon:        rounded-lg (w-8 h-8)
Spinner:          rounded-full
Inner cards:      rounded-lg (e.g., category breakdown items)
```

## Shadows

```
Cards:            shadow-sm
Modals:           shadow-xl
Hover state:      hover:shadow-md (with transition-shadow)
No shadow:        (inputs, buttons - rely on borders)
```

## Interactive States

### Button States
```
Default:      variant color
Hover:        darker shade (e.g., blue-600 → blue-700)
Focus:        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-{color}-500
Disabled:     disabled:opacity-50 disabled:cursor-not-allowed
Loading:      spinner icon + disabled state
```

### Input States
```
Default:      border-gray-300
Focus:        focus:ring-2 focus:ring-blue-500 focus:border-transparent
Error:        border-red-500 focus:ring-red-500
Disabled:     bg-gray-100 cursor-not-allowed
```

### Link/Clickable States
```
Text links:   text-gray-500 hover:text-gray-700 transition-colors
Card hover:   transition-shadow hover:shadow-md cursor-pointer
Icon buttons: text-gray-400 hover:text-gray-600 transition-colors
```

## Animation Tokens

```css
/* Defined in globals.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Usage */
.animate-fadeIn   → modal backdrop
.animate-scaleIn  → modal content
```

### Transition Defaults
```
Color transitions:  transition-colors duration-200
Shadow transitions: transition-shadow (default 150ms)
General:            transition duration-200
```

## Component Patterns

### Card with Title Pattern
```tsx
<BaseCard className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-900">제목</h2>
    <span className="text-sm text-gray-500">부제</span>
  </div>
  {/* content */}
</BaseCard>
```

### Category Indicator Pattern
```tsx
<div className="flex items-center gap-2">
  <div
    className="w-2.5 h-2.5 rounded-full"
    style={{ backgroundColor: category.color }}
  />
  <span className="text-sm text-gray-600">{category.name}</span>
</div>
```

### Form Field Pattern
```tsx
<BaseInput
  label="금액"
  type="number"
  value={amount}
  onChange={setAmount}
  required
  min={1}
  error={errors.amount}
/>
```

### Page Header Pattern
```tsx
<div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold text-gray-900">페이지 제목</h1>
  <div className="flex gap-2">
    <BaseButton variant="secondary">보조 액션</BaseButton>
    <BaseButton>주요 액션</BaseButton>
  </div>
</div>
```

### Responsive Grid Pattern
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* items */}
</div>
```

### Loading State Pattern
```tsx
<div className="flex items-center justify-center py-12">
  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
</div>
```

## Responsive Breakpoints

| Breakpoint | Width  | Typical Usage                        |
|------------|--------|--------------------------------------|
| Default    | <640px | Single column, compact padding       |
| `sm:`      | 640px  | Expanded card padding, show labels   |
| `md:`      | 768px  | Two-column grid                      |
| `lg:`      | 1024px | Max page padding                     |

The app is designed for max-w-4xl (896px), so `lg:` and above are mainly for padding.

## z-index Scale

```
Modal backdrop:   z-50
Modal content:    z-50 (child of backdrop)
Header:           (no z-index, natural stacking)
```

## Icon Guidelines

- Use inline SVG only (no icon libraries)
- Size: `w-5 h-5` (default), `w-4 h-4` (small)
- Color: `currentColor` with stroke, no fill
- Stroke width: `strokeWidth="2"`
- Line caps: `strokeLinecap="round" strokeLinejoin="round"`
