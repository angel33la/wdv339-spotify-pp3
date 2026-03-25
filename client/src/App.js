import { Suspense, lazy, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { PlayerContext, PlayerProvider } from "./context/PlayerContext";
import { PlaylistProvider } from "./context/PlaylistContext";
import { applyThemeFromPreferences } from "./utils/preferences";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";

const Navbar = lazy(() => import("./components/layout/Navbar"));
const PersistentPlayer = lazy(
  () => import("./components/player/PersistentPlayer"),
);
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));
const Home = lazy(() => import("./pages/Home"));
const Playlists = lazy(() => import("./pages/Playlists"));
const PlaylistDetails = lazy(() => import("./pages/PlaylistDetails"));
const Songs = lazy(() => import("./pages/Songs"));
const Preferences = lazy(() => import("./pages/Preferences"));

function DeferredPersistentPlayer() {
  const { currentSong } = useContext(PlayerContext);

  if (!currentSong?.videoId) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <PersistentPlayer />
    </Suspense>
  );
}

export default function App() {
  const { user, token, logout } = useContext(AuthContext);

  useEffect(() => {
    applyThemeFromPreferences();
  }, []);

  return (
    <PlayerProvider>
      <PlaylistProvider>
        <BrowserRouter>
          <Suspense fallback={null}>
            {token && <Navbar user={user} onLogout={logout} />}
          </Suspense>

          <main>
            <Suspense
              fallback={<div className="routeLoading">Loading...</div>}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/playlists"
                  element={
                    <ProtectedRoute>
                      <Playlists />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/playlists/:id"
                  element={
                    <ProtectedRoute>
                      <PlaylistDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/songs"
                  element={
                    <ProtectedRoute>
                      <Songs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/preferences"
                  element={
                    <ProtectedRoute>
                      <Preferences />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <DeferredPersistentPlayer />
        </BrowserRouter>
      </PlaylistProvider>
    </PlayerProvider>
  );
}
