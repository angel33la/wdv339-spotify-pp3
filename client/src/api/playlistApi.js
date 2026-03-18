import axios from "axios";
import { authHeaders, requestWithRefresh } from "./requestWithRefresh";

const API = process.env.REACT_APP_API_URL;

export const getPlaylists = async (token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.get(`${API}/api/playlists`, {
        headers: authHeaders(activeToken),
      }),
    token,
  );

  return res.data;
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

  return res.data;
};
