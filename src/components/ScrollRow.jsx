import { useRef } from "react";
import { motion } from "framer-motion";

export default function ScrollRow({ title, children, loading, error, accent = "red" }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.7 
        : scrollLeft + clientWidth * 0.7;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const accentColor = accent === "gold" ? "#F5C518" : "#E50914";

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-6 sm:px-8 mb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className={`w-1 h-6 rounded-full`} style={{ backgroundColor: accentColor }} />
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-white hover:bg-[#1a1a1a] transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-white hover:bg-[#1a1a1a] transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-6 sm:px-8 pb-4 scroll-smooth scrollbar-hide"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-36 sm:w-40 md:w-44 aspect-[2/3] bg-[#111] rounded-2xl animate-pulse"
            />
          ))
        ) : error ? (
          <p className="text-sm text-[#E50914]/70 py-10">Failed to load content.</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
