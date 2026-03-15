export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("auth-token-changed"));
};

export const removeToken = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-token-changed"));
};
