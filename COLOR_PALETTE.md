# Smartslate.io - Color Palette Documentation

## Brand Colors

### Primary Colors
- **Dark Background**: `#091420` (hsl(211, 55%, 8%))
  - Used for: Main background, dark sections
  - CSS Variable: `--brand-bg`

- **Card Background**: `#142433` (hsl(210, 40%, 14%))
  - Used for: Card components, content containers
  - CSS Variable: `--brand-card-bg`

- **Accent Color**: `#a7dadb` (hsl(180, 42%, 76%))
  - Used for: Primary buttons, highlights, important UI elements
  - CSS Variable: `--brand-accent`
  - RGB: `167, 218, 219`

### Secondary Colors
- **Accent Dark**: `#6ec8c9` (hsl(180, 42%, 55%))
  - Used for: Hover states, darker accents
  - CSS Variable: `--brand-accent-dark`

- **Accent Light**: `#e7f8f9` (hsl(180, 42%, 90%))
  - Used for: Subtle highlights, light backgrounds
  - CSS Variable: `--brand-accent-light`

## Text Colors
- **Main Text**: `#E4E4E4` (hsl(0, 0%, 89%))
  - Used for: Primary text content
  - CSS Variable: `--text-main`

- **Secondary Text**: `#A0AEC0` (hsl(214, 14%, 63%))
  - Used for: Secondary information, captions
  - CSS Variable: `--text-secondary`

## UI Colors
### Buttons & Interactive Elements
- **Primary Button**: `#4F46E5` (hsl(243, 72%, 58%))
  - Used for: Main call-to-action buttons
  - CSS Variable: `--primary`
  - Text Color: `#FFFFFF`

- **Hover State**: Lighter shade of primary
  - Used for: Button hover states
  - Effect: 15% lighter than primary

### Borders & Dividers
- **Default Border**: `rgba(255, 255, 255, 0.1)`
  - Used for: Subtle separators, card borders

- **Accent Border**: `hsla(180, 42%, 76%, 0.4)`
  - Used for: Interactive element borders, focus states

## Gradients
1. **Primary Gradient**:
   ```
   linear-gradient(90deg, #a7dadb, #6ec8c9)
   ```
   - Used for: Hero sections, important CTAs
   - CSS Variable: `--gradient-primary`

2. **Subtle Background Gradient**:
   ```
   linear-gradient(180deg, #09141f, #142433)
   ```
   - Used for: Section backgrounds
   - CSS Variable: `--gradient-subtle`

## Special Effects
- **Glow Effect**:
  ```
  box-shadow: 0 0 25px rgba(167, 218, 219, 0.3);
  ```
  - Used for: Active states, important interactive elements

- **Card Hover Effect**:
  ```
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  ```

## Usage Guidelines
1. **Text Readability**: 
   - Always maintain sufficient contrast between text and background colors
   - Use `--text-main` for primary content, `--text-secondary` for less important text

2. **Interactive Elements**:
   - Always include hover and active states
   - Use the primary accent color for main CTAs
   - Secondary actions can use the muted color palette

3. **Accessibility**:
   - Ensure all text has a minimum contrast ratio of 4.5:1 against its background
   - Use the accent colors sparingly to highlight important elements

4. **Dark Mode**:
   - The color palette is designed with dark mode in mind
   - All colors should maintain their relative contrast in both light and dark modes

## CSS Variables Reference
```css
:root {
  /* Brand Colors */
  --brand-bg: 211 55% 8%;
  --brand-card-bg: 210 40% 14%;
  --brand-accent: 180 42% 76%;
  --brand-accent-rgb: 167, 218, 219;
  --brand-accent-dark: 180 42% 55%;
  --brand-accent-light: 180 42% 90%;
  
  /* Text Colors */
  --text-main: 0 0% 89%;
  --text-secondary: 214 14% 63%;
  
  /* UI Colors */
  --primary: 243 72% 58%;
  --primary-foreground: 0 0% 100%;
  
  /* Gradients */
  --gradient-primary: linear-gradient(90deg, hsl(var(--brand-accent)), hsl(var(--brand-accent-dark)));
  --gradient-subtle: linear-gradient(180deg, hsl(var(--brand-bg)), hsl(var(--brand-card-bg)));
}
```

## Implementation Notes
- Always use CSS variables for theming and consistency
- For performance, prefer `hsla()` over `rgba()` for colors with transparency
- Use the provided gradients for visual hierarchy and depth
- Test all interactive states (hover, active, focus) for proper contrast and visibility
