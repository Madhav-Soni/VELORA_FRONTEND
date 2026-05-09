# VELORA Logo - Quick Selection Guide

## 🎯 Which Variant Should I Use?

### The Fast Decision Tree

```
Is your background...

DARK (cinema black, dark blue, dark green)?
  → Use: VeloraLogoIcon or VeloraLogoDark
  → Why: Standard glow works perfectly on dark

COOL-TONED (blue, purple, cool gray)?
  → Use: VeloraLogoIcon or VeloraLogoOutlined
  → Why: Red pops naturally against cool tones

WARM/ORANGE (explosions, fire, warm grading)?
  → Use: VeloraLogoWarmBg
  → Why: Stronger glow prevents red-on-orange blend
  
VIBRANT/SATURATED (bright pink, neon, sci-fi)?
  → Use: VeloraLogoUltraContrast
  → Why: Ultra glow cuts through saturation

UNSURE / MIXED?
  → Use: VeloraLogoOutlined
  → Why: White border works on literally anything
```

---

## 📋 Complete Reference Table

| Component | Best For | Size Range | Animation |
|-----------|----------|-----------|-----------|
| **VeloraLogoIcon** | General UI, standard use | 32-72px | Hover scale |
| **VeloraLogoFull** | Login pages, hero sections | Default | Spring entrance |
| **VeloraLogoNavbar** | Headers, fixed bars | 40px | Hover + tap |
| **VeloraLogoDark** | Pure black, loading screens | 40-56px | Breathing pulse |
| **VeloraLogoWarmBg** | Warm/orange backgrounds | 32-72px | Hover scale |
| **VeloraLogoOutlined** | Any difficult background | 32-72px | Hover scale |
| **VeloraLogoUltraContrast** | Vibrant/saturated backgrounds | 32-72px | Hover scale |
| **VeloraLogoSplash** | Loading/splash screens | Fixed large | Full animation |

---

## 🎬 Real Background Examples

### Example 1: Dark Monster Film (Godzilla)
```jsx
// Background: Olive-brown, very dark
// Solution:
import { VeloraLogoIcon, VeloraLogoDark } from '@/components/VeloraLogo';

// Option A: Standard (works great)
<VeloraLogoIcon size={56} />

// Option B: Enhanced glow (dramatic effect)
<VeloraLogoDark />
```

### Example 2: Superhero Action (Avengers)
```jsx
// Background: Purple/blue color grading, mid-tone
// Solution:
import { VeloraLogoIcon, VeloraLogoOutlined } from '@/components/VeloraLogo';

// Option A: Standard (perfect against cool tones)
<VeloraLogoIcon size={56} />

// Option B: With border (extra definition)
<VeloraLogoOutlined size={56} />
```

### Example 3: Warm Action (Explosions/Fire)
```jsx
// Background: Orange/yellow/red explosions
// Solution - IMPORTANT: Use WarmBg variant!
import { VeloraLogoWarmBg } from '@/components/VeloraLogo';

// WRONG - will blend!
<VeloraLogoIcon size={56} />  // ✗ Red on orange = blend

// RIGHT - stronger glow
<VeloraLogoWarmBg size={56} />  // ✓ Works perfectly
```

### Example 4: Vibrant Sci-Fi (Saturated colors)
```jsx
// Background: Pink-magenta-orange gradient, VERY bright
// Solution - Use UltraContrast:
import { VeloraLogoUltraContrast } from '@/components/VeloraLogo';

// WRONG - standard might not pop enough
<VeloraLogoIcon size={56} />  // ~ Okay

// RIGHT - maximum impact
<VeloraLogoUltraContrast size={56} />  // ✓ Dominates
```

### Example 5: Pure Black (Dark/Loading)
```jsx
// Background: Cinema black (#0a0a0a or pure black)
// Solution:
import { VeloraLogoDark, VeloraLogoSplash } from '@/components/VeloraLogo';

// For subtle presence:
<VeloraLogoDark />

// For splash/loading:
<VeloraLogoSplash />
```

---

## 🎨 Visual Impact Comparison

### Logo Appearance by Variant

```
VeloraLogoIcon
├─ Glow:     Medium (35px, 0.35 opacity)
├─ Shine:    Standard (25% white)
├─ Core:     Standard gradient (red-500→red-600→red-900)
└─ Best on:  Dark, cool-toned backgrounds

VeloraLogoWarmBg
├─ Glow:     STRONG (60px, 0.6 opacity)
├─ Shine:    Enhanced (35% white)
├─ Core:     Darker gradient (red-600→red-700→red-900)
└─ Best on:  Warm/orange backgrounds

VeloraLogoOutlined
├─ Border:   2px WHITE - creates hard edge
├─ Glow:     Medium (30px, 0.5 opacity)
├─ Shine:    Standard
├─ Core:     Standard gradient
└─ Best on:  Blended or difficult backgrounds

VeloraLogoUltraContrast
├─ Glow:     EXTREME (50px red + 80px red dual shadow)
├─ Inset:    Deep black inner shadow
├─ Shine:    Maximum (40% white)
├─ Core:     Deep gradient (red-600→red-700→BLACK)
└─ Best on:  Vibrant/saturated backgrounds

VeloraLogoDark
├─ Glow:     Enhanced (40px, 0.6 opacity dual-layer)
├─ Animation: Breathing pulse (3s cycle)
├─ Shine:    Enhanced (30% white)
├─ Effect:   Alive feeling on black
└─ Best on:  Pure black, loading screens
```

---

## 💡 Pro Tips

### Tip 1: Size Matters
```jsx
// Mobile/compact UI
<VeloraLogoIcon size={32} />

// Navbar/headers
<VeloraLogoNavbar />  // Built-in 40px

// General UI
<VeloraLogoIcon size={56} />  // Sweet spot

// Featured/hero
<VeloraLogoIcon size={64} />

// Splash/loading
<VeloraLogoSplash />  // 96px large
```

### Tip 2: Animation Control
```jsx
// Animated entry (login pages)
<VeloraLogoFull animated={true} />

// Static (header, always visible)
<VeloraLogoNavbar />  // No animation by default

// Loading with animation
<VeloraLogoSplash />  // Built-in animations

// Custom animation
<div className="animate-pulse">
  <VeloraLogoIcon size={56} />
</div>
```

### Tip 3: Accessibility
```jsx
// All variants are WCAG AA compliant
// 3.9:1 contrast ratio maintained
// Support screenreaders

// Good:
<div aria-label="VELORA branding">
  <VeloraLogoFull />
</div>

// Better for semantic:
<header role="banner">
  <VeloraLogoNavbar />
</header>
```

### Tip 4: Performance
```jsx
// All variants are CSS-only (no SVG)
// No performance penalty
// 60fps animations
// Minimal bundle impact (283 lines total)

// Safe to use multiple:
<VeloraLogoNavbar />           {/* Navbar */}
<VeloraLogoIcon size={32} />    {/* Favicon */}
{/* All render smoothly */}
```

---

## 🚀 Copy-Paste Examples

### Login Page
```jsx
import { VeloraLogoFull } from '@/components/VeloraLogo';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black">
      <header className="absolute top-8 left-8">
        <VeloraLogoFull animated={true} />
      </header>
      {/* Login form */}
    </div>
  );
}
```

### Navbar
```jsx
import { VeloraLogoNavbar } from '@/components/VeloraLogo';

export function TopNavbar() {
  return (
    <nav className="sticky top-0 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <VeloraLogoNavbar />
        {/* Other nav items */}
      </div>
    </nav>
  );
}
```

### Movie Poster Background (Warm/Orange)
```jsx
import { VeloraLogoWarmBg } from '@/components/VeloraLogo';

export function MovieScene() {
  return (
    <div
      className="w-full h-96 bg-cover bg-center relative"
      style={{ backgroundImage: 'url(/movies/action-fire.jpg)' }}
    >
      <div className="absolute top-8 left-8">
        <VeloraLogoWarmBg size={56} />
      </div>
    </div>
  );
}
```

### Sci-Fi Background (Vibrant/Saturated)
```jsx
import { VeloraLogoUltraContrast } from '@/components/VeloraLogo';

export function SciFiScene() {
  return (
    <div className="w-full h-96 bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-500">
      <div className="absolute top-8 left-8">
        <VeloraLogoUltraContrast size={56} />
      </div>
    </div>
  );
}
```

### Loading Screen
```jsx
import { VeloraLogoSplash } from '@/components/VeloraLogo';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <VeloraLogoSplash />
    </div>
  );
}
```

---

## 🎓 Decision Flowchart (Text Version)

```
Start: I need to add VELORA logo to [SCENE]

Q1: Is the background predominantly DARK?
  YES → Q2
  NO  → Q3

Q2: Is it cool-toned (blue/purple) or neutral?
  YES → Use VeloraLogoIcon ✓
  NO  → Use VeloraLogoDark ✓

Q3: Is the background WARM (orange/yellow/red)?
  YES → Use VeloraLogoWarmBg ✓ (IMPORTANT!)
  NO  → Q4

Q4: Is the background VIBRANT/SATURATED?
  YES → Use VeloraLogoUltraContrast ✓
  NO  → Q5

Q5: Is the background MIXED or UNCERTAIN?
  YES → Use VeloraLogoOutlined ✓ (always works)
  NO  → Use VeloraLogoIcon ✓ (default)

Done! Logo selected. 🎉
```

---

## ❓ FAQ

**Q: Can I use the same variant on all backgrounds?**
A: Technically yes, but VeloraLogoIcon doesn't work ideally on warm backgrounds. Use adaptive variants for best results.

**Q: Which variant is fastest?**
A: All are equally fast. They're all CSS-based. No performance difference.

**Q: Can I mix variants in one page?**
A: Yes! Use appropriate variant for each background section.

**Q: Do I need to import all variants?**
A: No, import only what you need:
```jsx
import { VeloraLogoNavbar } from '@/components/VeloraLogo';
```

**Q: What if I still don't know which to pick?**
A: Use VeloraLogoOutlined - white border works EVERYWHERE.

---

## 🎬 Summary

| Background Type | Recommended | Why |
|-----------------|------------|-----|
| Dark/Cinema | VeloraLogoIcon | Default works perfectly |
| Cool/Blue | VeloraLogoIcon | Red pops on cool |
| Warm/Orange | VeloraLogoWarmBg | Prevents blending |
| Vibrant/Saturated | VeloraLogoUltraContrast | Cuts through saturation |
| Uncertain | VeloraLogoOutlined | Universal fallback |
| Loading/Splash | VeloraLogoSplash | Built-in animation |
| Headers/Fixed | VeloraLogoNavbar | Compact, professional |

---

**Need help?** Check LogoShowcase.jsx to see all variants on real backgrounds. 🚀
