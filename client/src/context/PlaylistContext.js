import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPlaylists } from "../api/playlistApi";
import { AuthContext } from "./AuthContext";

export const PlaylistContext = createContext({
  playlists: [],
  loading: false,
  error: "",
  refreshPlaylists: async () => [],
});

export function PlaylistProvider({ children }) {
  const { token, loading: authLoading } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshPlaylists = useCallback(
    async ({ silent = false } = {}) => {
      if (!token) {
        setPlaylists([]);
        setError("");
        setLoading(false);
        return [];
      }

      if (!silent) {
        setLoading(true);
      }

      try {
        setError("");
        const data = await getPlaylists(token);
        setPlaylists(data);
        return data;
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to load playlists.";
        setError(message);
        return [];
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [token],
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    refreshPlaylists();
  }, [authLoading, refreshPlaylists]);

  const value = useMemo(
    () => ({ playlists, loading, error, refreshPlaylists }),
    [playlists, loading, error, refreshPlaylists],
  );

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}
