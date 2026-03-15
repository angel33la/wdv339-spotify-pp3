import axios from "axios";
import { getToken, setToken } from "../utils/token";

const API = process.env.REACT_APP_API_URL;

const refreshAccessToken = async () => {
  const response = await axios.post(
    `${API}/api/auth/refresh`,
    {},
    {
      withCredentials: true,
    },
  );

  const nextToken = response.data?.token;
  if (!nextToken) {
    throw new Error("Refresh endpoint did not return an access token");
  }

  setToken(nextToken);
  return nextToken;
};

export const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const requestWithRefresh = async (requestFn, providedToken) => {
  const firstToken = providedToken || getToken();

  try {
    return await requestFn(firstToken);
  } catch (error) {
    const status = error?.response?.status;
    if (status !== 401) {
      throw error;
    }

    const refreshedToken = await refreshAccessToken();
    return requestFn(refreshedToken);
  }
};
