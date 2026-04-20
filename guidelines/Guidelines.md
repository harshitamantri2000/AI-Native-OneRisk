# LoKey Design System — Figma Make Spec

---

## TOKENS

### Color Tokens

#### Primary
- color.primary.500 = #1766D6
- color.primary.600 = #104EB8

#### Neutral
- color.neutral.0 = #FFFFFF
- color.neutral.50 = #FAFAFB
- color.neutral.100 = #ECEDED
- color.neutral.200 = #BFC2C4
- color.neutral.900 = #131A25
- color.neutral.950 = #0A0D13

#### Success
- color.success.50 = #E9FCE5
- color.success.200 = #B6F1A5
- color.success.500 = #4CAF47
- color.success.700 = #1A7A1E
- color.success.900 = #043A1A

#### Info
- color.info.50 = #E0FCFD
- color.info.200 = #C8FAFA
- color.info.400 = #5CD4E6
- color.info.500 = #33AFCD
- color.info.600 = #007FAD
- color.info.800 = #004A7C

#### Warning
- color.warning.50 = #FEF2CB
- color.warning.200 = #F9C963
- color.warning.600 = #CB7100
- color.warning.700 = #AA5800

#### Destructive
- color.destructive.200 = #FCC3A1
- color.destructive.500 = #E23318
- color.destructive.600 = #C21B11
- color.destructive.700 = #A20C0F
- color.destructive.900 = #6C0417

---

### Opacity Tokens (State Logic)

- opacity.04 = 4%
- opacity.08 = 8%
- opacity.12 = 12%
- opacity.20 = 20%
- opacity.32 = 32%
- opacity.40 = 40%
- opacity.60 = 60%
- opacity.90 = 90%

---

### Typography Tokens

- type.display.desktop = 52 / 140% / 0.4%
- type.display.tablet = 44 / 132% / 0.4%
- type.display.mobile = 38 / 132% / 0.4%

- type.heading.h1.desktop = 40 / 132% / 0.4%
- type.heading.h1.mobile = 38 / 132% / 0.4%

- type.paragraph.lg.desktop = 20 / 140% / 0.4%
- type.paragraph.lg.mobile = 18 / 140% / 0.4%
- type.paragraph.md.desktop = 18 / 140% / 0.4%
- type.paragraph.md.mobile = 16 / 140% / 0.4%
- type.paragraph.sm.desktop = 16 / 140% / 0.4%
- type.paragraph.sm.mobile = 14 / 140% / 0.4%
- type.paragraph.xs.desktop = 14 / 140% / 0.4%
- type.paragraph.xs.mobile = 12 / 140% / 0.4%

---

## COMPONENTS

## Button

### Properties
- type: primary | secondary | tertiary | outlined | ghost
- size: xxs | xs | s | m | l | xl | xxl
- state: default | hover | active | disabled
- leftIcon: true | false
- rightIcon: true | false

---

### Size Tokens

- button.size.xxs.height = 24
- button.size.xs.height = 28
- button.size.s.height = 32
- button.size.m.height = 36
- button.size.l.height = 40
- button.size.xl.height = 44
- button.size.xxl.height = 48

---

### Button / Primary

| State | Background | Text |
|------|-----------|------|
| default | color.primary.500 | color.neutral.0 |
| hover | color.primary.600 | color.neutral.0 |
| active | color.primary.500 @ opacity.90 | color.neutral.0 |
| disabled | color.primary.500 @ opacity.32 | color.neutral.0 @ opacity.60 |

---

### Button / Secondary

| State | Background | Border | Text |
|------|-----------|--------|------|
| default | color.primary.500 @ opacity.08 | color.primary.500 @ opacity.50 | color.primary.500 |
| hover | color.primary.500 @ opacity.20 | color.primary.500 @ opacity.60 | color.primary.500 |
| active | color.primary.500 @ opacity.12 | color.primary.500 @ opacity.50 | color.primary.500 |
| disabled | color.primary.500 @ opacity.04 | color.primary.500 @ opacity.20 | color.primary.500 @ opacity.40 |

---

### Button / Tertiary

| State | Background | Border | Text |
|------|-----------|--------|------|
| default | color.neutral.0 | color.neutral.900 | color.neutral.900 |
| hover | color.neutral.900 @ opacity.04 | color.neutral.900 | color.neutral.900 |
| active | color.neutral.900 @ opacity.08 | color.neutral.900 | color.neutral.900 |
| disabled | none | color.neutral.900 @ opacity.20 | color.neutral.900 @ opacity.40 |

---

### Button / Outlined

| State | Background | Border | Text |
|------|-----------|--------|------|
| default | color.neutral.0 | color.primary.500 | color.primary.500 |
| hover | color.primary.500 @ opacity.04 | color.primary.500 | color.primary.500 |
| active | color.primary.500 @ opacity.08 | color.primary.500 | color.primary.500 |
| disabled | none | color.primary.500 @ opacity.20 | color.primary.500 @ opacity.40 |

---

### Button / Ghost

| State | Background | Text |
|------|-----------|------|
| default | none | color.primary.500 |
| hover | color.primary.500 @ opacity.04 | color.primary.500 |
| active | color.primary.500 @ opacity.08 | color.primary.500 |
| disabled | none | color.primary.500 @ opacity.40 |

---

## Chip

### Properties
- style: filled | accent | outline
- type: primary | extra | neutral | success | error | info
- size: s | m | l | xl
- state: default | hover | active | disabled
- leftIcon: true | false
- rightIcon: true | false

---

### Size Tokens

- chip.size.s.height = 24
- chip.size.m.height = 28
- chip.size.l.height = 32
- chip.size.xl.height = 36

---

### Chip / Filled (Primary)

| State | Background | Text |
|------|-----------|------|
| default | color.primary.500 | color.neutral.0 |
| hover | color.primary.600 | color.neutral.0 |
| active | color.primary.500 @ opacity.90 | color.neutral.0 |
| disabled | color.primary.500 @ opacity.32 | color.primary.500 @ opacity.60 |

---

### Chip / Accent (Primary)

| State | Background | Border | Text |
|------|-----------|--------|------|
| default | color.primary.500 @ opacity.12 | color.primary.500 @ opacity.20 | color.primary.600 |
| hover | color.primary.500 @ opacity.20 | color.primary.500 @ opacity.20 | color.primary.600 |
| active | color.primary.500 @ opacity.16 | color.primary.500 @ opacity.20 | color.primary.600 |
| disabled | color.primary.500 @ opacity.06 | color.primary.500 @ opacity.12 | color.primary.600 @ opacity.40 |

---

### Chip / Outline (Primary)

| State | Background | Border | Text |
|------|-----------|--------|------|
| default | none | color.primary.500 | color.primary.600 |
| hover | color.primary.500 @ opacity.08 | color.primary.500 | color.primary.600 |
| active | color.primary.500 @ opacity.12 | color.primary.500 | color.primary.600 |
| disabled | none | color.primary.500 @ opacity.20 | color.primary.600 @ opacity.40 |

---

## GLOBAL RULES (Figma Make)

- All components must be variant-driven
- State is a first-class property
- No implicit inheritance
- No visual overrides outside tokens
- Opacity tokens must be reused
- Active = pressed state
- Disabled = non-interactive