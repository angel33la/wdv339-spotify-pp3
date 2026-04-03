import axios from "axios";
import { authHeaders, requestWithRefresh } from "./requestWithRefresh";
import { getApiBaseUrl } from "../utils/apiBaseUrl";

const API = getApiBaseUrl();
const PLAYLIST_CACHE_TTL_MS = 30_000;
const inFlightPlaylistRequests = new Map();
const playlistCache = new Map();

const clearPlaylistCache = (token) => {
  const requestKey = token || "";
  playlistCache.delete(requestKey);
  inFlightPlaylistRequests.delete(requestKey);
};

export const getPlaylists = async (token) => {
  const requestKey = token || "";
  const cachedPlaylists = playlistCache.get(requestKey);

  if (
    cachedPlaylists &&
    Date.now() - cachedPlaylists.timestamp < PLAYLIST_CACHE_TTL_MS
  ) {
    return cachedPlaylists.data;
  }

  if (inFlightPlaylistRequests.has(requestKey)) {
    return inFlightPlaylistRequests.get(requestKey);
  }

  const requestPromise = requestWithRefresh(
    (activeToken) =>
      axios.get(`${API}/api/playlists`, {
        headers: authHeaders(activeToken),
      }),
    token,
  )
    .then((res) => {
      playlistCache.set(requestKey, { data: res.data, timestamp: Date.now() });
      return res.data;
    })
    .finally(() => {
      inFlightPlaylistRequests.delete(requestKey);
    });

  inFlightPlaylistRequests.set(requestKey, requestPromise);
  return requestPromise;
};

export const getPlaylist = async (id, token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.get(`${API}/api/playlists/${id}`, {
        headers: authHeaders(activeToken),
      }),
    token,
  );

  return res.data;
};

export const createPlaylist = async (name, token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.post(
        `${API}/api/playlists`,
        { name },
        {
          headers: authHeaders(activeToken),
        },
      ),
    token,
  );

  clearPlaylistCache(token);
  return res.data;
};

export const updatePlaylistName = async (playlistId, name, token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.put(
        `${API}/api/playlists/${playlistId}`,
        { name },
        {
          headers: authHeaders(activeToken),
        },
      ),
    token,
  );

  clearPlaylistCache(token);
  return res.data;
};

export const addSongToPlaylist = async (playlistId, song, token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.post(`${API}/api/playlists/${playlistId}/songs`, song, {
        headers: authHeaders(activeToken),
      }),
    token,
  );

  clearPlaylistCache(token);
  return res.data;
};

export const removeSongFromPlaylist = async (playlistId, songId, token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.delete(`${API}/api/playlists/${playlistId}/songs/${songId}`, {
        headers: authHeaders(activeToken),
      }),
    token,
  );

  clearPlaylistCache(token);
  return res.data;
};

export const deletePlaylist = async (playlistId, token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.delete(`${API}/api/playlists/${playlistId}`, {
        headers: authHeaders(activeToken),
      }),
    token,
  );

  clearPlaylistCache(token);
  return res.data;
};
