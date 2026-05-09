import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useVeloraStore } from "../../store/useVeloraStore";
import { VeloraLogoIcon } from "../VeloraLogo";

const NAV = [
  { to: "/home", label: "Home", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg> },
  { to: "/discover", label: "Movies", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
  { to: "/trending", label: "Trending", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> },
  { to: "/favorites", label: "Favorites", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> },
  { to: "/watchlist", label: "Watchlist", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg> },
  { to: "/profile", label: "Profile", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useVeloraStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Hamburger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 z-50 p-2 glass rounded-xl md:hidden text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Sidebar Content */}
      <AnimatePresence>
        {(isOpen || true) && (
          <aside className={`fixed left-0 top-0 bottom-0 w-[210px] z-50 flex flex-col bg-[#0a0a0a] border-r border-white/5 transition-transform duration-500 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/40 hover:text-white md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Logo */}
            <div className="px-6 pt-10 pb-12 flex items-center gap-3">
              <VeloraLogoIcon size={40} />
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-black font-display text-gradient-red tracking-wider">
                  VELORA
                </span>
                <p className="text-[8px] font-black text-white/20 tracking-[0.3em] uppercase">Curated</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-2">
              {NAV.map(({ to, label, icon }) => (
                <NavLink key={to} to={to}>
                  {({ isActive }) => (
                    <div className="relative group/nav">
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative z-10 ${
                          isActive
                            ? "text-white"
                            : "text-white/40 hover:text-white/70"
                        }`}
                      >
                        <span className={`transition-colors duration-300 ${isActive ? "text-brand" : "group-hover/nav:text-white/60"}`}>
                          {icon}
                        </span>
                        {label}

                        {isActive && (
                          <motion.div
                            layoutId="sidebar-dot"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_#E50914]"
                          />
                        )}
                      </motion.div>

                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-2xl"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom section */}
            <div className="px-4 pb-8 space-y-2 border-t border-white/5 pt-6">
              <div className="px-4 py-1">
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-white/30 hover:text-brand hover:bg-brand/5 transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
