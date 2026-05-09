import { VeloraLogoFull, VeloraLogoNavbar, VeloraLogoIcon, VeloraLogoDark, VeloraLogoSplash, VeloraLogoFavicon } from '../components/VeloraLogo';

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-7xl tracking-widest">
            VELORA Brand System
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Premium cinematic streaming platform identity. Netflix minimalism meets Apple TV+ elegance.
          </p>
        </div>

        {/* Full Logo Variants */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <h2 className="font-display text-3xl tracking-wider">Full Logo Versions</h2>
          
          <div className="space-y-8">
            {/* Light Background */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-wider">Full Logo - Light Background</h3>
              <div className="bg-gradient-to-b from-gray-900 to-black p-12 rounded-3xl border border-white/10 flex items-center justify-center min-h-40">
                <VeloraLogoFull animated={true} />
              </div>
            </div>

            {/* Dark Background */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-wider">Full Logo - Dark Background</h3>
              <div className="bg-black p-12 rounded-3xl border border-white/10 flex items-center justify-center min-h-40">
                <VeloraLogoDark />
              </div>
            </div>
          </div>
        </div>

        {/* Icon Sizes */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <h2 className="font-display text-3xl tracking-wider">Icon Sizes</h2>
          <p className="text-white/40 text-sm">Responsive logo icon for various layouts</p>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[32, 40, 48, 56, 64, 72].map((size) => (
              <div key={size} className="space-y-2 flex flex-col items-center">
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-center w-full">
                  <VeloraLogoIcon size={size} />
                </div>
                <span className="text-xs text-white/40 font-mono">{size}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navbar Version */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <h2 className="font-display text-3xl tracking-wider">Navbar Version</h2>
          <p className="text-white/40 text-sm">Compact logo for header/navbar usage</p>
          
          <div className="bg-black/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm flex items-center gap-4 w-fit">
            <VeloraLogoNavbar />
            <div className="text-white/40 text-sm">← Navbar logo with optional text</div>
          </div>
        </div>

        {/* Splash Screen */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <h2 className="font-display text-3xl tracking-wider">Loading / Splash Screen</h2>
          <p className="text-white/40 text-sm">Full-screen splash with animation</p>
          
          <div className="bg-black/80 border border-white/10 rounded-3xl p-16 flex items-center justify-center min-h-96">
            <VeloraLogoSplash />
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <h2 className="font-display text-3xl tracking-wider">Usage Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Login Pages",
                description: "Use VeloraLogoFull on auth pages with dark cinema backdrops for maximum visual impact"
              },
              {
                title: "Navbar/Header",
                description: "Use VeloraLogoNavbar in fixed headers. Compact version saves space while maintaining brand presence"
              },
              {
                title: "Favicon",
                description: "Use VeloraLogoIcon size={32} for favicon and app icons across browsers and devices"
              },
              {
                title: "Loading Screens",
                description: "Use VeloraLogoSplash for app splash screens and loading states with built-in animations"
              },
              {
                title: "Dark Backgrounds",
                description: "Use VeloraLogoDark on pure black or very dark backgrounds for enhanced glow effects"
              },
              {
                title: "Dark Mode",
                description: "All logos are optimized for dark mode. Red and white contrast maintains premium feel"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Design Notes */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <h2 className="font-display text-3xl tracking-wider">Design Characteristics</h2>
          
          <div className="space-y-4">
            {[
              { label: "Color Palette", value: "Premium Red (#E50914) + Black (#0a0a0a) + White accents" },
              { label: "Icon Shape", value: "Rounded square (16px radius) - modern, cinematic feel" },
              { label: "Typography", value: "Bebas Neue for display, DM Sans for body - luxury minimalism" },
              { label: "Glow Effects", value: "Subtle red shadow (35-40px blur) - cinematic depth without excess" },
              { label: "Shine Layer", value: "White gradient top (1/3 height) - premium glass aesthetic" },
              { label: "Animations", value: "Smooth spring physics for hover/hover states" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-brand min-w-32 font-black text-sm">{item.label}</span>
                <span className="text-white/60 text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Example */}
        <div className="space-y-8 pt-8 border-t border-white/10 pb-8">
          <h2 className="font-display text-3xl tracking-wider">Implementation</h2>
          
          <div className="bg-black/80 border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-sm text-white/60 overflow-x-auto">
            <div className="text-brand">// Import the logo component</div>
            <div className="text-white/40">import {'{'} VeloraLogoFull, VeloraLogoIcon, VeloraLogoNavbar {'}'} from &apos;@/components/VeloraLogo&apos;</div>
            <div className=""></div>
            <div className="text-brand">// Use in your pages</div>
            <div className="text-white/40">&lt;VeloraLogoFull animated={'{true}'} /&gt;</div>
            <div className="text-white/40">&lt;VeloraLogoIcon size={'{56}'} /&gt;</div>
            <div className="text-white/40">&lt;VeloraLogoNavbar /&gt;</div>
          </div>
        </div>

      </div>
    </div>
  );
}
