import axios from "axios";
import { authHeaders, requestWithRefresh } from "./requestWithRefresh";
import { getApiBaseUrl } from "../utils/apiBaseUrl";

const API = getApiBaseUrl();

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
