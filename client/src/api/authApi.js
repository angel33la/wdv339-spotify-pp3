import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const getMe = async (token) => {
  const res = await axios.get(`${API}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
