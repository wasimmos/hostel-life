---
name: HostelHire Campus UI
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444653'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#532a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#743d00'
  on-tertiary-container: '#ffa85d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for verified, localized collegiate micro-economies. It directly addresses the operational realities of engineering campus hostel clusters: dense peer networks, low-bandwidth bursts, transactional speed, and intense interpersonal trust requirements. 

The aesthetic is Modern Functionalist: high-contrast, structured, crisp, and tactile without resorting to skeuomorphic gimmicks or drop-shadow overhead. It draws architectural discipline from transit apps and field utilities while retaining a modern student-first sensibility. The interface avoids frivolous decorative assets, prioritizing glanceable data densities, immediate task validation, and unambiguous transaction statuses.

The emotional target is dependable, accountable, and direct. The interface must feel like an institutional utility maintained by peers: secure against non-campus outsiders, strict about student verification, yet nimble enough to facilitate instant gig handoffs between hostel rooms in seconds.

## Colors

The palette establishes an unambiguous hierarchy built for mobile readability under high sunlight and dim hostel fluorescent lighting alike.

- Primary (#1E40AF): Core brand authority, principal calls-to-action, navigation anchors, active state indicators.
- Secondary Accent (#059669): Reserved strictly for positive trust signals, including institutional verification badges, successful transactions, confirmed payouts, and completed tasks.
- Warning / Pending (#D97706): Denotes ongoing escrows, gigs awaiting peer check-in, review warnings, and action deadlines.
- Canvas Background (#F8FAFC): A tailored off-white base that cuts eye strain and prevents high-glare fatigue on mobile devices. Pure white (#FFFFFF) is reserved exclusively for elevated foreground surfaces and interactive cards.
- Structural Neutral (#E2E8F0): The defining stroke value for all containers, card dividers, and input boundaries.
- Typography Hierarchy: Slate 900 (#0F172A) provides maximum legibility for titles, task summaries, and numeric rates. Slate 500 (#64748B) serves secondary metadata: hostel block tags, room numbers, and relative timestamps.

## Typography

Plus Jakarta Sans governs the entire typographic stack, delivering clear geometric clarity and generous counters that remain legible down to small screen viewports.

- Font Choice: Only Plus Jakarta Sans is permitted. Generic alternatives such as Inter or technical fonts like Space Grotesk are disallowed to keep the app humanist yet disciplined.
- Punctuation Standards: Do not use em dashes under any circumstances. Replace with standard hyphens surrounded by spaces or clean colons.
- Monetary Display: Payouts and gig costs rely on `currency-display` (bold tabular presentation) to avoid optical misreadings during peer transactions.
- Metadata: Subtexts, hostel wing markers, and timestamps take `label-md` or `label-sm` with slight positive tracking for crisp readability on mobile displays.

## Layout & Spacing

This design system uses a strict mobile-first fluid layout bounded by a maximum center-aligned canvas width of 480px on desktop and tablet environments, preserving a focused PWA smartphone utility experience.

- Canvas Logic: Margins stick to a firm 16px (1rem) margin on portable devices, ensuring maximal line length for gig details without cramping the thumb sweep zones.
- Grid & Stacking: Vertical spacing follows a tight 4px baseline rhythm. Interactive touch cards use internal paddings of 12px or 16px (`space-md` or `space-lg`).
- Component Gaps: Standard structural gaps between list elements, cards, and sections sit uniformly at `space-md` (0.75rem) to balance scanning density with thumb-driven separation.

## Elevation & Depth

This system operates without drop shadows, box shadows, blur filters, or elevation layers. Depth is realized entirely via tonal contrast and crisp geometric containment.

- Zero Shadows: Do not apply drop shadows to any container, modal, sheet, or button.
- Low-Contrast Outlines: Separation is achieved by stacking #FFFFFF cards on top of the #F8FAFC canvas, bound by a continuous, 1px perimeter border rendered in #E2E8F0.
- State Elevation: An interactive card is not lifted with shadow on touch or focus. Instead, its perimeter border transitions directly from #E2E8F0 to the Primary Accent (#1E40AF) or its surface shifts to #F1F5F9.
- Modals and Action Sheets: Modals overlay the canvas with a solid high-contrast border and a flat 40% opacity neutral backdrop, relying on structural framing rather than blurry depth cues.

## Shapes

The shape hierarchy is structured, athletic, and strictly non-amorphous.

- Base Metric: The system sets a primary base radius of 0.5rem (8px), expanding to 0.75rem (12px) for cards, dialogs, and large action containers (`rounded-lg` through `rounded-xl`).
- Pill Boundaries: Pill shapes (full rounding) are strictly restricted to state chips and verification badges. Interactive buttons, cards, list groups, and text fields must preserve their clean corner geometry.
- Discipline: Avoid over-rounded, inflated bubbles or asymmetric borders. Structural corners must remain uniform on all four vertices.

## Components

### Buttons
- Primary Button: Background #1E40AF, text #FFFFFF, no drop shadow, border-radius 8px (`rounded-md`), vertical padding 12px, horizontal padding 16px. Active/pressed state shifts background to #1D4ED8.
- Secondary Button: Background #FFFFFF, border 1px solid #E2E8F0, text #0F172A. Active/pressed state shifts border to #1E40AF and surface to #F8FAFC.
- Destructive Button: Background #FFFFFF, border 1px solid #EF4444, text #EF4444.

### Cards & Gig Tiles
- Surface: Crisp #FFFFFF on the #F8FAFC background.
- Border: 1px solid #E2E8F0. Radius is 12px (`rounded-xl`).
- Internal Hierarchy: Card header holds user verification pill and hostel designation (e.g., "Hostel 4 : Room 218"); card body contains the gig title and task requirements; card footer displays tabular payout amount and a direct action trigger.

### Verification Chips & Status Badges
- Verified Badge: Background #ECFDF5, border 1px solid #A7F3D0, text #059669. Accompanied by a bespoke checkmark path icon. No emojis.
- Pending/Escrow Chip: Background #FFFBEB, border 1px solid #FDE68A, text #D97706.
- Hostel Block Tag: Background #F1F5F9, border 1px solid #CBD5E1, text #475569.

### Inputs & Selectors
- Text Inputs: Background #FFFFFF, border 1px solid #E2E8F0, border-radius 8px, text #0F172A, placeholder text #94A3B8. Focus state swaps border to 1.5px solid #1E40AF with zero focus rings or outer glows.
- Selection Controls: Checkboxes and radio targets use a 20px box with a 1px solid #CBD5E1 border, filling with #1E40AF and a crisp white SVG check icon when selected.

### Lists & Activity Feeds
- Grouped layout: Contained in single bordered surfaces where individual rows are separated by 1px solid #F1F5F9 lines. Touch highlights trigger an immediate surface transition to #F8FAFC.