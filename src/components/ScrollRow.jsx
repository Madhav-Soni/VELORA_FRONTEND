import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MovieSkeleton = () => (
  <div className="flex-shrink-0 w-36 sm:w-40 md:w-44 aspect-[2/3] rounded-2xl skeleton" />
);

const ActorSkeleton = () => (
  <div className="flex-shrink-0 w-24 sm:w-28 flex flex-col items-center">
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full skeleton mb-3" />
    <div className="w-16 h-2 skeleton rounded" />
  </div>
);

export default function ScrollRow({
  title,
  children,
  loading,
  error,
  accent = "red",
  onSeeAll,
  skeletonType = "movie"
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, children, loading]);

  const handleWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.shiftKey ? e.deltaY : e.deltaX;
    const dy = e.shiftKey ? 0 : e.deltaY;
    const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 4;
    if (!isHorizontal) return;
    e.preventDefault();
    el.scrollLeft += dx;
    checkScroll();
  }, [checkScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const accentColor = accent === "gold" ? "#F5C518" : "#E50914";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="py-6 relative group/row"
      style={{ willChange: "auto" }}
    >

      <div className="flex items-center justify-between px-6 sm:px-8 mb-5">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="w-1 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
            {title}
          </h2>
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 hover:text-brand transition-colors mt-1"
            >
              See All →
            </button>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <button
            disabled={!canScrollLeft}
            onClick={() => scroll("left")}
            className={`w-9 h-9 rounded-full glass flex items-center justify-center text-white transition-all duration-300 ${!canScrollLeft ? "opacity-30 cursor-not-allowed scale-90" : "hover:bg-white/10 hover:scale-110 active:scale-95"
              }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            disabled={!canScrollRight}
            onClick={() => scroll("right")}
            className={`w-9 h-9 rounded-full glass flex items-center justify-center text-white transition-all duration-300 ${!canScrollRight ? "opacity-30 cursor-not-allowed scale-90" : "hover:bg-white/10 hover:scale-110 active:scale-95"
              }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Gradient Fades */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none"
            />
          )}
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto px-6 sm:px-8 pb-6 scrollbar-hide"
          style={{
            overscrollBehaviorX: "contain",
            overscrollBehaviorY: "auto",
            touchAction: "pan-x pan-y pinch-zoom",
            WebkitOverflowScrolling: "auto",
          }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              skeletonType === "movie" ? <MovieSkeleton key={i} /> : <ActorSkeleton key={i} />
            ))
          ) : error ? (
            <div className="w-full py-12 flex flex-col items-center justify-center glass rounded-3xl border-dashed border-white/10">
              <p className="text-sm text-brand/60 font-medium tracking-wide">FAILED TO LOAD CONTENT</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </motion.section>
  );
}