---
name: ui-ux-pro-max
description: UI/UX design intelligence for web applications. Provides reasoning rules, styles (Glassmorphism, Bento Grid, Dark Mode, AI-Native UI), color palette profiles, typography hierarchy, accessibility standards (WCAG AAA/AA), and component polish to eliminate generic AI output.
---

# UI/UX Pro Max - Design Intelligence

Provides design intelligence for building distinct, high-craft user interfaces rather than generic AI output.

## Priority Rules for Visual & Interaction Design

| Priority | Category | Impact | Key Standard | Anti-Patterns (Forbidden) |
|---|---|---|---|---|
| 1 | **Accessibility & Contrast** | CRITICAL | Text contrast 4.5:1 min (WCAG AA). Visible keyboard focus rings. Accessible labels on icon buttons. | Gray-on-gray low contrast, removing `:focus-visible` outline. |
| 2 | **Touch & Interaction** | CRITICAL | Min target 44×44px. Instant `:active` state. Subtle hover states. | Relying on hover-only interactions for essential actions. |
| 3 | **Surface & Depth Hierarchy** | HIGH | Multi-layered dark slate tones (`--surface`, `--surface-2`), translucent 1px borders (`rgba(255,255,255,0.08)` to `0.14`). | Flat solid black, harsh 100% white borders, noisy neon borders. |
| 4 | **Bento Grid & Layout** | HIGH | Clear visual hierarchy, consistent 12-16px gap rhythm, generous padding, responsive breakpoints (375px, 768px, 1024px, 1280px). | Unequal card heights, broken chip labels, horizontal scrolling. |
| 5 | **Typography Hierarchy** | HIGH | Modern sans/display headers paired with legible body (`Inter`, `Bricolage Grotesque`), strict sizing scale, proportional line-heights (1.1 - 1.2 for headings, 1.5 - 1.6 for body). | Body text < 13px, uppercase without letter-spacing, unbalanced line wraps. |
| 6 | **Animation & Transitions** | HIGH | Sub-250ms duration, `transform` and `opacity` only, custom deceleration curves, respect `prefers-reduced-motion`. | `transition: all`, `ease-in` curves, layout reflow animations (`height`, `width`). |
