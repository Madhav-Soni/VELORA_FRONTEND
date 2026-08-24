import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useVeloraStore } from '../store/useVeloraStore'
import { backend } from '../api/backend'

const BACKDROPS = [
  'https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg',
  'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
  'https://image.tmdb.org/t/p/original/iopYFB1b6Bh7FWZh3onQhph1sih.jpg',
  'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
  'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
  'https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg',
  'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
  'https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg',
  'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
]

const backdrop =
  BACKDROPS[Math.floor(Math.random() * BACKDROPS.length)]

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, token, isOnboarded } = useVeloraStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (token) {
    return <Navigate to={isOnboarded ? '/home' : '/onboarding'} replace />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await backend.login(email, password)

      setAuth({
        userId: data.userId,
        token: data.token,
        name: data.name,
      })

      const {
        syncPreferencesWithBackend,
        syncWatchlistWithBackend,
      } = useVeloraStore.getState()

      await Promise.all([
        syncPreferencesWithBackend(),
        syncWatchlistWithBackend(),
      ])

      const onboarded = useVeloraStore.getState().isOnboarded

      navigate(onboarded ? '/home' : '/onboarding')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      const data = await backend.googleLogin(credentialResponse.credential)

      setAuth({
        userId: data.userId,
        token: data.token,
        name: data.name,
      })

      const {
        syncPreferencesWithBackend,
        syncWatchlistWithBackend,
      } = useVeloraStore.getState()

      await Promise.all([
        syncPreferencesWithBackend(),
        syncWatchlistWithBackend(),
      ])

      const onboarded = useVeloraStore.getState().isOnboarded

      navigate(onboarded ? '/home' : '/onboarding')
    } catch (err) {
      setError(err.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt=""
          className="w-full h-full object-cover scale-105"
        />

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Gradient depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute top-8 left-8 z-20 flex items-center gap-4"
      >

        {/* Brand */}
        <span className="font-display text-4xl tracking-[0.18em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
          VELORA
        </span>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">

          {/* Soft glass layer */}
          <div className="absolute inset-0 bg-white/[0.03]" />

          <div className="relative p-8">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-4xl text-white tracking-wide mb-2">
                Welcome back
              </h1>

              <p className="text-gray-400 text-sm">
                Discover what fits your taste.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-red-400 transition-all text-sm placeholder:text-gray-500"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3.5 pr-12 focus:outline-none focus:border-red-400 transition-all text-sm placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-white to-gray-200 text-black font-bold py-3.5 px-5 rounded-2xl hover:brightness-110 transition-all duration-300 text-sm shadow-[0_0_25px_rgba(255,255,255,0.12)] disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Continue with Email'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-black/60 px-3 text-[11px] font-medium text-gray-400 uppercase tracking-widest backdrop-blur-md">
                or
              </span>
            </div>

            {/* Continue with Google */}
            <div className="flex justify-center w-full min-h-[44px]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                theme="filled_black"
                shape="pill"
                width="100%"
              />
            </div>


            {/* Signup */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="text-white hover:text-red-300 transition-colors font-semibold"
              >
                Sign up
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-gray-600 text-xs mt-3">
              By continuing, you agree to our Terms & Privacy Policy
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  )
}