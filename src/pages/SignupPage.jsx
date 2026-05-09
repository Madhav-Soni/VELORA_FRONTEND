import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useVeloraStore } from '../store/useVeloraStore'
import { backend } from '../api/backend'

const BACKDROP = 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'

export default function SignupPage() {
  const navigate = useNavigate()
  const { setAuth } = useVeloraStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const data = await backend.signup(name.trim(), email.trim(), password)
      // Store token + userId + name in Zustand persist
      setAuth({ userId: data.userId, token: data.token, name: name.trim() })
      navigate('/onboarding')
    } catch (err) {
      setError(err.message || 'Signup failed. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img src={BACKDROP} alt="" className="w-full h-full object-cover scale-105" />
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
          <span className="font-display text-white text-lg">V</span>
        </div>
        <span className="font-display text-3xl tracking-widest text-white">VELORA</span>
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
            <h1 className="font-display text-4xl text-white tracking-wide mb-2">Create account</h1>
            <p className="text-gray-400 text-sm">Join Velora and discover entertainment tailored to your vibe.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4" id="signup-form">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <input
              id="signup-name"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-sm"
              required
            />
            <input
              id="signup-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-sm"
              required
            />
            <input
              id="signup-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-sm"
              required
            />
            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-sm"
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              id="signup-submit"
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-5 rounded-2xl hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/" className="text-white hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
