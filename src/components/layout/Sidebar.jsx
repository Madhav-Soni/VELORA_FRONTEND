import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCineStore } from "../../store/useCineStore";

const NAV = [
  {
    to: "/home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    to: "/discover",
    label: "Discover",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    to: "/watchlist",
    label: "Watchlist",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    to: "/preferences",
    label: "Preferences",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { resetPreferences } = useCineStore();

  const handleLogout = () => {
    resetPreferences();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] z-40 flex flex-col bg-[#0a0a0a] border-r border-[#181818]">
      {/* Logo */}
      <div className="px-6 pt-7 pb-8">
        <span
          className="text-2xl font-black tracking-tight"
          style={{
            fontFamily: "'Bebas Neue', cursive",
            background: "linear-gradient(135deg, #E50914 30%, #ff6b35)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CINEMATCH
        </span>
        <p className="text-[10px] text-[#333] tracking-[0.25em] uppercase mt-0.5">Your taste. Refined.</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, label, icon }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#E50914]/12 text-white border border-[#E50914]/20"
                    : "text-[#555] hover:text-[#bbb] hover:bg-white/4"
                }`}
              >
                <span className={isActive ? "text-[#E50914]" : ""}>{icon}</span>
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E50914]"
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-6 space-y-1 border-t border-[#141414] pt-4">
        <div className="px-3 py-2">
          <p className="text-[10px] text-[#2a2a2a] uppercase tracking-widest font-semibold mb-2">Account</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#444] hover:text-[#E50914] hover:bg-[#E50914]/6 transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
