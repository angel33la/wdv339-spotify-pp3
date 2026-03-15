import axios from "axios";
import { authHeaders, requestWithRefresh } from "./requestWithRefresh";

const API = process.env.REACT_APP_API_URL;

export const searchSongs = async (query, token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.get(`${API}/api/search?q=${encodeURIComponent(query)}`, {
        headers: authHeaders(activeToken),
      }),
    token,
  );

  return res.data.results;
};
