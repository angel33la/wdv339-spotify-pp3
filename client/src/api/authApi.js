import axios from "axios";
import { authHeaders, requestWithRefresh } from "./requestWithRefresh";

const API = process.env.REACT_APP_API_URL;

export const getMe = async (token) => {
  const res = await requestWithRefresh(
    (activeToken) =>
      axios.get(`${API}/api/auth/me`, {
        headers: authHeaders(activeToken),
      }),
    token,
  );

  return res.data;
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
  const res = await axios.get(`${API}/api/auth/logout`, {
    withCredentials: true,
  });

  return res.data;
};
