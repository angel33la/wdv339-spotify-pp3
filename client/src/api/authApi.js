import axios from "axios";
import { authHeaders, requestWithRefresh } from "./requestWithRefresh";

const API = process.env.REACT_APP_API_URL;
const PROFILE_CACHE_TTL_MS = 30_000;
const inFlightMeRequests = new Map();
const profileCache = new Map();

export const getMe = async (token) => {
  const requestKey = token || "";
  const cachedProfile = profileCache.get(requestKey);

  if (
    cachedProfile &&
    Date.now() - cachedProfile.timestamp < PROFILE_CACHE_TTL_MS
  ) {
    return cachedProfile.data;
  }

  if (inFlightMeRequests.has(requestKey)) {
    return inFlightMeRequests.get(requestKey);
  }

  const requestPromise = requestWithRefresh(
    (activeToken) =>
      axios.get(`${API}/api/auth/me`, {
        headers: authHeaders(activeToken),
      }),
    token,
  )
    .then((res) => {
      profileCache.set(requestKey, { data: res.data, timestamp: Date.now() });
      return res.data;
    })
    .finally(() => {
      inFlightMeRequests.delete(requestKey);
    });

  inFlightMeRequests.set(requestKey, requestPromise);
  return requestPromise;
};

export const refreshToken = async () => {
  const res = await axios.post(
    `${API}/api/auth/refresh`,
    {},
    { withCredentials: true },
  );

  return res.data;
};

export const logoutRequest = async () => {
  profileCache.clear();
  inFlightMeRequests.clear();

  const res = await axios.get(`${API}/api/auth/logout`, {
    withCredentials: true,
  });

  return res.data;
};
