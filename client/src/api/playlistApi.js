import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getPlaylists = async (token) => {
  const res = await axios.get(`${API}/api/playlists`, authConfig(token));
  return res.data;
};

export const getPlaylist = async (id, token) => {
  const res = await axios.get(`${API}/api/playlists/${id}`, authConfig(token));
  return res.data;
};

export const createPlaylist = async (name, token) => {
  const res = await axios.post(
    `${API}/api/playlists`,
    { name },
    authConfig(token),
  );
  return res.data;
};

export const addSongToPlaylist = async (playlistId, song, token) => {
  const res = await axios.post(
    `${API}/api/playlists/${playlistId}/songs`,
    song,
    authConfig(token),
  );
  return res.data;
};

export const removeSongFromPlaylist = async (playlistId, songId, token) => {
  const res = await axios.delete(
    `${API}/api/playlists/${playlistId}/songs/${songId}`,
    authConfig(token),
  );
  return res.data;
};
