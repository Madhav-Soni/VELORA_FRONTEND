import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useCineStore } from '../store/useCineStore'
import { backend } from '../api/backend'

const BACKDROP = 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, token, isOnboarded } = useCineStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect already-authenticated users
  if (token) {
    return <Navigate to={isOnboarded ? '/home' : '/onboarding'} replace />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await backend.login(email, password)
      setAuth({ userId: data.userId, token: data.token, name: data.name })
      
      // Sync state from backend
      const { syncPreferencesWithBackend, syncWatchlistWithBackend } = useCineStore.getState();
      await Promise.all([
        syncPreferencesWithBackend(),
        syncWatchlistWithBackend()
      ]);

      const onboarded = useCineStore.getState().isOnboarded
      navigate(onboarded ? '/home' : '/onboarding')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={BACKDROP}
          alt=""
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 left-8 flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/30">
          <span className="font-display text-white text-lg">CM</span>
        </div>
        <span className="font-display text-3xl tracking-widest text-white">CINEMATCH</span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="font-display text-4xl text-white tracking-wide mb-2">Welcome back</h1>
            <p className="text-gray-400 text-sm">Your personalized cinema, curated for you.</p>
          </div>

          {/* Buttons */}
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}
            
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-sm"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-sm"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-5 rounded-2xl hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Continue with Email"}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:underline font-semibold">
              Sign up
            </Link>
          </p>

          <p className="text-center text-gray-600 text-xs mt-3">
            By continuing, you agree to our Terms &amp; Privacy Policy
          </p>
        </div>

        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute -left-4 top-1/3 bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-3 py-2 text-xs text-gray-300 hidden md:block"
        >
          🎬 10,000+ movies
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute -right-4 bottom-1/4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-3 py-2 text-xs text-gray-300 hidden md:block"
        >
        </motion.div>
      </motion.div>
    </div>
  )
}