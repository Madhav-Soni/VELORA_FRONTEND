import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component } from "react";
import { useCineStore } from "./store/useCineStore";

import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import WatchlistPage from "./pages/WatchlistPage";
import PreferencesPage from "./pages/PreferencesPage";
import ProfilePage from "./pages/ProfilePage";

// ── TanStack Query client ────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// ── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white gap-6 px-6">
          <div className="text-5xl">🎬</div>
          <h1 className="text-2xl font-black font-display tracking-wide">Something went wrong</h1>
          <p className="text-white/40 text-sm text-center max-w-xs">{this.state.error?.message}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
            className="px-8 py-3 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-2xl"
          >
            Return Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Route Guards ─────────────────────────────────────────────────────────────

/** Require auth — redirect to login if no token */
function RequireAuth({ children }) {
  const { token } = useCineStore();
  if (!token) return <Navigate to="/" replace />;
  return children;
}

/** Require onboarding complete — redirect to onboarding if not done yet */
function RequireOnboarding({ children }) {
  const { isOnboarded } = useCineStore();
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

/** Prevent onboarded+authed users from revisiting onboarding */
function OnboardingGuard({ children }) {
  const { token, isOnboarded } = useCineStore();
  if (!token) return <Navigate to="/" replace />;
  if (isOnboarded) return <Navigate to="/home" replace />;
  return children;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public auth routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Onboarding — requires auth, but not yet onboarded */}
            <Route
              path="/onboarding"
              element={
                <OnboardingGuard>
                  <OnboardingPage />
                </OnboardingGuard>
              }
            />

            {/* Protected app routes — require auth + onboarding */}
            <Route
              element={
                <RequireAuth>
                  <RequireOnboarding>
                    <AppLayout />
                  </RequireOnboarding>
                </RequireAuth>
              }
            >
              <Route path="/home" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route
                path="/trending"
                element={<div className="p-10 text-white text-2xl font-bold">Trending Coming Soon</div>}
              />
              <Route
                path="/favorites"
                element={<div className="p-10 text-white text-2xl font-bold">Favorites Coming Soon</div>}
              />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/preferences" element={<PreferencesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}