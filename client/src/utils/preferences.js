const PREFS_KEY = "music-app-preferences";
const REC_STATS_KEY = "music-app-rec-stats";

export const DEFAULT_PREFERENCES = {
  themeMode: "dark",
  favoriteGenres: [],
  favoriteArtists: [],
  allowExplicit: true,
  profileTagline: "",
  recommendationStrength: 60,
  prioritizeRecentlyPlayed: true,
};

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const sanitizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 20);
};

export const loadPreferences = () => {
  const raw = localStorage.getItem(PREFS_KEY);
  const parsed = raw
    ? safeParse(raw, DEFAULT_PREFERENCES)
    : DEFAULT_PREFERENCES;

  return {
    ...DEFAULT_PREFERENCES,
    ...parsed,
    favoriteGenres: sanitizeStringArray(parsed.favoriteGenres),
    favoriteArtists: sanitizeStringArray(parsed.favoriteArtists),
    recommendationStrength: Number.isFinite(parsed.recommendationStrength)
      ? Math.max(0, Math.min(100, parsed.recommendationStrength))
      : DEFAULT_PREFERENCES.recommendationStrength,
    allowExplicit: parsed.allowExplicit !== false,
    prioritizeRecentlyPlayed: parsed.prioritizeRecentlyPlayed !== false,
    profileTagline: String(parsed.profileTagline || "").slice(0, 120),
  };
};

export const savePreferences = (preferences) => {
  const normalized = {
    ...loadPreferences(),
    ...preferences,
    favoriteGenres: sanitizeStringArray(preferences.favoriteGenres),
    favoriteArtists: sanitizeStringArray(preferences.favoriteArtists),
    profileTagline: String(preferences.profileTagline || "").slice(0, 120),
  };

  localStorage.setItem(PREFS_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("preferences-changed"));

  return normalized;
};

const getThemeMode = () => {
  const { themeMode } = loadPreferences();
  if (themeMode === "light" || themeMode === "dark") {
    return themeMode;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

export const applyThemeFromPreferences = () => {
  const mode = getThemeMode();
  document.body.dataset.theme = mode;
};

export const loadRecommendationStats = () => {
  const raw = localStorage.getItem(REC_STATS_KEY);
  const parsed = raw ? safeParse(raw, {}) : {};

  return {
    playedArtistCounts: parsed.playedArtistCounts || {},
    addedArtistCounts: parsed.addedArtistCounts || {},
  };
};

export const pushRecommendationEvent = (type, song) => {
  const artist = String(song?.channelTitle || song?.artist || "")
    .trim()
    .toLowerCase();

  if (!artist) {
    return;
  }

  const stats = loadRecommendationStats();
  const key = type === "added" ? "addedArtistCounts" : "playedArtistCounts";
  const currentCount = Number(stats[key][artist] || 0);
  stats[key][artist] = currentCount + 1;

  localStorage.setItem(REC_STATS_KEY, JSON.stringify(stats));
};
