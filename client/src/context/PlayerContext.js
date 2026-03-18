import { createContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "music-matie-current-song";

export const PlayerContext = createContext({
  currentSong: null,
  setCurrentSong: () => {},
  clearCurrentSong: () => {},
});

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(() => {
    try {
      const storedSong = window.sessionStorage.getItem(STORAGE_KEY);
      return storedSong ? JSON.parse(storedSong) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentSong) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentSong));
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore session storage failures and keep player state in memory.
    }
  }, [currentSong]);

  const value = useMemo(
    () => ({
      currentSong,
      setCurrentSong,
      clearCurrentSong: () => setCurrentSong(null),
    }),
    [currentSong],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
