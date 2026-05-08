import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCineStore } from "./store/useCineStore";

import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import WatchlistPage from "./pages/WatchlistPage";
import PreferencesPage from "./pages/PreferencesPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function RequireOnboarding({ children }) {
  const { isOnboarded } = useCineStore();
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* App routes — wrapped in layout + onboarding gate */}
          <Route
            element={
              <RequireOnboarding>
                <AppLayout />
              </RequireOnboarding>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/trending" element={<div className="p-10 text-white text-2xl font-bold">Trending Coming Soon</div>} />
            <Route path="/favorites" element={<div className="p-10 text-white text-2xl font-bold">Favorites Coming Soon</div>} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}