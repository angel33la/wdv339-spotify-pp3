import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const searchSongs = async (query, token) => {
  const res = await axios.get(
    `${API}/api/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data.results;
};
