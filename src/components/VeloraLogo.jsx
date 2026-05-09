import { motion } from 'framer-motion';

/**
 * VeloraLogo Component
 * Premium cinematic streaming platform logo
 * Variants: full, navbar, compact, icon, favicon
 */

// Main Logo - Full Version
export function VeloraLogoFull({ animated = true, className = "" }) {
  const logoVariants = {
    hidden: { y: -25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const boxVariants = {
    hover: {
      scale: 1.08,
      boxShadow: "0 0 40px rgba(239, 68, 68, 0.5)"
    }
  };

  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated ? {
    initial: "hidden",
    animate: "visible",
    variants: logoVariants,
    whileHover: "hover"
  } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`flex items-center gap-4 ${className}`}
    >
      {/* Icon Box */}
      <motion.div
        variants={boxVariants}
        className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(239,68,68,0.4)] border border-red-400/30 group cursor-pointer flex-shrink-0"
      >
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-900" />
        
        {/* Cinematic depth layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

        {/* Subtle shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/25 to-transparent" />

        {/* Inner shadow for depth */}
        <div className="absolute inset-0 shadow-inset shadow-black/30" />

        {/* Glow pulse on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-500"
        />

        {/* Letter V */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <span className="font-display text-white text-2xl tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] font-black">
            V
          </span>
        </div>
      </motion.div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="font-display text-3xl tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] font-black leading-tight">
          VELORA
        </span>
        <span className="text-[9px] font-black text-white/30 tracking-[0.3em] uppercase mt-0.5">
          Cinema
        </span>
      </div>
    </Wrapper>
  );
}

// Navbar Version - Compact
export function VeloraLogoNavbar({ className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 group cursor-pointer ${className}`}
    >
      {/* Compact Icon */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.35)] border border-red-400/25 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent" />
        
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <span className="font-display text-white text-lg tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] font-black">
            V
          </span>
        </div>
      </div>

      {/* Text */}
      <span className="font-display text-lg tracking-[0.15em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] font-black hidden sm:inline">
        VELORA
      </span>
    </motion.div>
  );
}

// Icon Only Version
export function VeloraLogoIcon({ size = 56, className = "" }) {
  const sizeClass = {
    32: "w-8 h-8",
    40: "w-10 h-10",
    48: "w-12 h-12",
    56: "w-14 h-14",
    64: "w-16 h-16",
    72: "w-20 h-20"
  }[size] || "w-14 h-14";

  const textSize = {
    32: "text-sm",
    40: "text-base",
    48: "text-lg",
    56: "text-2xl",
    64: "text-3xl",
    72: "text-4xl"
  }[size] || "text-2xl";

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className={`relative ${sizeClass} rounded-lg overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.35)] border border-red-400/25 group cursor-pointer ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent" />
      
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <span className={`font-display text-white ${textSize} tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] font-black`}>
          V
        </span>
      </div>
    </motion.div>
  );
}

// Dark Background Optimized Version
export function VeloraLogoDark({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Enhanced glow on dark backgrounds */}
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.6),0_0_80px_rgba(239,68,68,0.2)] border border-red-500/40 group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
        
        {/* Extra glow effect for dark backgrounds */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]"
        />

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <span className="font-display text-white text-xl tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-black">
            V
          </span>
        </div>
      </div>

      <div>
        <span className="font-display text-2xl tracking-[0.18em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] font-black">
          VELORA
        </span>
      </div>
    </motion.div>
  );
}

// Loading Screen / Splash Logo
export function VeloraLogoSplash({ className = "" }) {
  const iconVariants = {
    initial: { scale: 0, rotateZ: -180, opacity: 0 },
    animate: {
      scale: 1,
      rotateZ: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center gap-6 ${className}`}
    >
      {/* Large Icon with animation */}
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(239,68,68,0.5)] border border-red-400/30"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/25 to-transparent" />

        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)]"
        />

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <span className="font-display text-white text-5xl tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] font-black">
            V
          </span>
        </div>
      </motion.div>

      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center"
      >
        <span className="font-display text-5xl tracking-[0.25em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] font-black">
          VELORA
        </span>
        <p className="text-sm text-white/40 tracking-[0.2em] uppercase mt-3 font-black">
          Cinema for the world
        </p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Favicon/App Icon Version (static, for export)
export function VeloraLogoFavicon() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-red-900">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/25 to-transparent" />
      
      <span className="font-display text-white text-4xl tracking-wider drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] font-black relative z-10">
        V
      </span>
    </div>
  );
}

export default VeloraLogoFull;
