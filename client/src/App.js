import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";

export default function App() {
  const { user, token, logout } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {token && <Navbar user={user} onLogout={logout} />}

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
      </Routes>
    </BrowserRouter>
  );
}
