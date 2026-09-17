# RESPONSIVE.md

## Objective

Build websites that are fully responsive, accessible, performant, and visually consistent across all modern devices.

The final result must look intentional and polished on:

* Small phones (320px+)
* Standard phones (375px–430px)
* Large phones (430px–480px)
* Small tablets (600px–768px)
* Tablets (768px–1024px)
* Small laptops (1024px–1280px)
* Laptops (1280px–1440px)
* Desktop monitors (1440px–1920px)
* Large displays (1920px–2560px)
* Ultra-wide displays (2560px+)

---

## Core Responsive Philosophy

Never design desktop-first.

Always design:

1. Mobile First
2. Tablet Second
3. Desktop Third
4. Large Screen Last

Layouts must scale naturally instead of relying on excessive breakpoint-specific fixes.

Prefer:

* Flexbox
* CSS Grid
* Fluid typography
* Relative units
* Container constraints

Avoid:

* Fixed widths
* Pixel-perfect positioning
* Absolute positioning for layout
* Horizontal scrolling

---

## Breakpoint System

Use these breakpoints consistently.

```css
/* Mobile */
@media (min-width: 320px)

/* Large Mobile */
@media (min-width: 480px)

/* Tablet */
@media (min-width: 768px)

/* Laptop */
@media (min-width: 1024px)

/* Desktop */
@media (min-width: 1280px)

/* Large Desktop */
@media (min-width: 1536px)

/* Ultra Wide */
@media (min-width: 1920px)
```

---

## Layout Rules

### Containers

Always use containers.

```css
.container {
    width: min(100% - 2rem, 1400px);
    margin-inline: auto;
}
```

Never allow content to stretch endlessly.

Maximum content width:

```css
max-width: 1400px;
```

Text-heavy pages:

```css
max-width: 70ch;
```

---

## Fluid Typography

Never use static typography if avoidable.

Use clamp() everywhere.

Examples:

```css
h1 {
    font-size: clamp(2rem, 5vw, 5rem);
}

h2 {
    font-size: clamp(1.5rem, 3vw, 3rem);
}

body {
    font-size: clamp(1rem, 1vw, 1.125rem);
}
```

Text should remain readable on:

* 320px phones
* 5K displays

without needing separate breakpoints.

---

## Responsive Spacing

Use fluid spacing.

```css
--space-xs: clamp(0.5rem, 1vw, 0.75rem);
--space-sm: clamp(0.75rem, 2vw, 1rem);
--space-md: clamp(1rem, 3vw, 2rem);
--space-lg: clamp(2rem, 5vw, 4rem);
--space-xl: clamp(3rem, 8vw, 8rem);
```

No hardcoded spacing unless necessary.

---

## Grid Rules

Use auto-fit whenever possible.

```css
grid-template-columns:
repeat(auto-fit, minmax(300px, 1fr));
```

Benefits:

* 1 column on phones
* 2 columns on tablets
* 3–6 columns on desktop

without manual breakpoints.

---

## Images

Every image must be responsive.

```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

Use:

```html
loading="lazy"
```

for non-critical images.

Prefer:

* WebP
* AVIF

Never upload unnecessarily large images.

---

## Navigation Rules

### Mobile

Use:

* Hamburger menu
* Full-screen drawer
* Bottom navigation when appropriate

### Desktop

Use:

* Horizontal navigation
* Visible links
* Hover states

Navigation must remain usable between 320px and 2560px.

---

## Component Rules

Every component must be tested at:

* 320px
* 375px
* 768px
* 1024px
* 1440px
* 1920px

Components must never:

* Overflow
* Overlap
* Create horizontal scrolling
* Break layout

---

## Buttons

Minimum touch target:

```css
min-height: 44px;
min-width: 44px;
```

Preferred:

```css
48px–56px
```

for mobile usability.

---

## Forms

Forms must:

### Mobile

```css
width: 100%;
```

### Desktop

```css
max-width: 600px;
```

Use vertical stacking on mobile.

Use multi-column layouts only on larger screens.

---

## Responsive Sections

Hero sections:

### Mobile

```text
Image
Headline
Description
CTA
```

### Desktop

```text
Headline + Description + CTA | Image
```

Never force desktop layouts onto phones.

---

## Accessibility Requirements

Always meet WCAG standards.

Requirements:

* Semantic HTML
* Keyboard navigation
* Focus states
* Alt text
* Proper labels
* ARIA only when needed

Minimum contrast:

```text
4.5:1
```

or higher.

---

## Performance Requirements

Target:

* Lighthouse 95+
* First Load < 2 seconds
* CLS near 0
* Minimal layout shifts

Optimize:

* Images
* Fonts
* JavaScript bundles

Avoid unnecessary dependencies.

---

## Animation Rules

Animations must:

* Enhance UX
* Never block interaction
* Respect reduced-motion settings

```css
@media (prefers-reduced-motion: reduce)
```

must be supported.

---

## Ultra-Wide Display Rules

For screens above 1920px:

Do not stretch content.

Instead:

```css
max-width: 1600px;
margin: auto;
```

Use whitespace intentionally.

Never create lines of text wider than:

```css
70ch
```

---

## QA Checklist

Before considering any page complete, verify:

* [ ] No horizontal scrolling at any size
* [ ] Layout works at 320px
* [ ] Layout works at 375px
* [ ] Layout works at 768px
* [ ] Layout works at 1024px
* [ ] Layout works at 1440px
* [ ] Layout works at 1920px
* [ ] Touch targets are large enough
* [ ] Images scale correctly
* [ ] Typography remains readable
* [ ] Navigation works everywhere
* [ ] Lighthouse score above 95
* [ ] Accessibility requirements pass
* [ ] Performance remains excellent
* [ ] Dark mode supported
* [ ] Reduced motion supported

---

## Final Requirement

Whenever generating frontend code:

1. Build mobile-first.
2. Use fluid sizing with clamp().
3. Use Grid and Flexbox.
4. Prevent horizontal overflow.
5. Optimize for all common screen sizes.
6. Prioritize usability over visual complexity.
7. Maintain visual consistency across every breakpoint.
8. Ensure the UI feels intentionally designed rather than merely resized.
9. Test every component at multiple viewport widths.
10. Deliver production-quality responsiveness by default.
