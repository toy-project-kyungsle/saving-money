# Accessibility Rules

All UI work in this project MUST follow these accessibility requirements.

## Required Standards

Target: **WCAG 2.1 Level AA**

## Semantic HTML

- Use `<button>` for actions, `<a>` for navigation (never `<div onClick>`)
- Use heading hierarchy: `<h1>` → `<h2>` → `<h3>` (never skip levels)
- Use `<main>`, `<header>`, `<nav>`, `<section>` landmarks
- Use `<label>` with `htmlFor` for all form inputs (BaseInput/BaseSelect already do this)
- Use `<table>` for tabular data, not `<div>` grids

## Keyboard Navigation

- All interactive elements must be reachable via Tab
- Modal must trap focus while open (BaseModal handles Escape key)
- Visible focus indicators: `focus:ring-2 focus:ring-offset-2` (already in BaseButton/BaseInput)
- Custom interactive elements need `tabIndex={0}` and `onKeyDown` for Enter/Space

## Color & Contrast

- Text on white background: minimum `gray-600` for small text (4.5:1 ratio)
- Large text (18px+ bold): minimum `gray-500` (3:1 ratio)
- Never use color alone to convey information - pair with text labels or icons
- Category colors are used as indicators alongside text, never alone
- Error states: red border + red text message (not just color change)

## ARIA

- Modal backdrop: `role` is implicit via structure
- Close buttons: `aria-label="닫기"` (already in BaseModal)
- Loading states: use `aria-busy="true"` on the loading container
- Icon-only buttons: always add `aria-label`
- Dynamic content updates: use `aria-live="polite"` for status messages

## Forms

- Required fields: visual indicator (`*`) + `required` attribute (BaseInput handles this)
- Error messages: associate with `aria-describedby` when possible
- Input grouping: use `<fieldset>` + `<legend>` for related fields
- Autocomplete: add `autoComplete` attribute for standard fields (email, name, etc.)

## Images & Icons

- Inline SVG icons that are decorative: `aria-hidden="true"`
- Inline SVG icons that convey meaning: add `role="img"` and `aria-label`
- The project uses no `<img>` tags currently; if added, always include `alt`

## Language

- `<html lang="ko">` is set in layout.tsx
- If mixing Korean and other languages, use `lang` attribute on the specific element

## Touch Targets

- Minimum touch target: 44x44px (buttons already meet this with py-2 minimum)
- Adequate spacing between interactive elements (gap-2 minimum)

## Checklist for New Components

Before marking any UI task as complete, verify:

- [ ] Can reach and activate all interactive elements with keyboard only
- [ ] Focus order is logical (left-to-right, top-to-bottom)
- [ ] Text contrast meets 4.5:1 (or 3:1 for large text)
- [ ] All form inputs have visible labels
- [ ] Error states are conveyed through text, not just color
- [ ] Interactive elements have hover AND focus styles
- [ ] Korean text renders correctly and reads naturally
