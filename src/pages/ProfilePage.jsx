import { motion } from "framer-motion";
import { useVeloraStore } from "../store/useVeloraStore";
import { IMAGE_BASE } from "../api/tmdb";
import { useNavigate } from "react-router-dom";

const ProfileStat = ({ label, value, icon, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
    className="glass rounded-3xl p-6 text-center border border-white/5 transition-colors"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <div className="text-3xl font-black text-white font-display tracking-tight leading-none mb-1">{value}</div>
    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{label}</div>
  </motion.div>
);

const ActionButton = ({ label, icon, onClick, variant = "default" }) => (
  <motion.button
    whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all border ${
      variant === "danger" 
        ? "text-brand/60 border-brand/10 hover:text-brand hover:border-brand/30" 
        : "text-white/40 border-white/5 hover:text-white hover:border-white/20"
    }`}
  >
    <span className="text-xl">{icon}</span>
    {label}
    <span className="ml-auto opacity-20">→</span>
  </motion.button>
);

export default function ProfilePage() {
  const navigate = useNavigate();
  const { selectedActors, selectedGenres, selectedMood, userName, logout, setIsOnboarded } = useVeloraStore();
  const { watchlist } = useVeloraStore();

  return (
    <div className="px-6 sm:px-12 py-10 max-w-2xl mx-auto pb-32">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-orange blur-2xl opacity-40 rounded-full" />
          <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand to-brand-orange flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white/10">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <span className="w-6 h-[2px] bg-brand" />
          <p className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">Premium Member</p>
          <span className="w-6 h-[2px] bg-brand" />
        </div>
        
        <h1 className="text-4xl font-black text-white font-display tracking-tight uppercase mb-2">
          {userName || 'Velora User'}
        </h1>
        <p className="text-sm text-white/30 font-medium">Velora Connoisseur since 2024</p>
        
        {selectedMood?.label && (
          <div className="mt-4 px-4 py-1.5 glass rounded-full border-gold/30 text-gold text-xs font-black uppercase tracking-widest">
            Vibe: {selectedMood.label}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-16">
        <ProfileStat index={0} icon="🔖" value={watchlist.length} label="Saved" />
        <ProfileStat index={1} icon="🎭" value={selectedActors.length} label="Actors" />
        <ProfileStat index={2} icon="🎬" value={selectedGenres.length} label="Genres" />
      </div>

      {/* Interests Summary */}
      <div className="space-y-12 mb-16">
        {selectedActors.length > 0 && (
          <div>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 px-2">Followed Talent</h3>
            <div className="flex flex-wrap gap-3">
              {selectedActors.map((actor) => (
                <div key={actor.id} className="flex items-center gap-2 pl-1 pr-4 py-1 glass rounded-full border border-white/5">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10">
                    <img 
                      src={actor.profile_path ? `${IMAGE_BASE}${actor.profile_path}` : "https://via.placeholder.com/32x32/111/444?text=?"} 
                      className="w-full h-full object-cover grayscale" 
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white/40">{actor.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedGenres.length > 0 && (
          <div>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 px-2">Preferred Genres</h3>
            <div className="flex flex-wrap gap-3">
              {selectedGenres.map((g) => (
                <span key={g.id} className="text-[11px] font-black uppercase tracking-widest text-white/30 bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action List */}
      <div className="space-y-3 pt-12 border-t border-white/5">
        <ActionButton icon="⚙️" label="Edit AI Preferences" onClick={() => navigate("/preferences")} />
        <ActionButton icon="🔖" label="Manage Watchlist" onClick={() => navigate("/watchlist")} />
        <ActionButton icon="🎬" label="Reset Onboarding" onClick={() => { setIsOnboarded(false); navigate("/onboarding"); }} />
        <div className="pt-4">
          <ActionButton 
            variant="danger" 
            icon="🚪" 
            label="Logout Session" 
            onClick={() => { logout(); navigate('/'); }} 
          />
        </div>
      </div>
    </div>
  );
}
