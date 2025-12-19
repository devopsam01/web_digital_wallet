import apiClient from "./apiClient";

export const loginUser = async (username, password) => {
  return apiClient.post("/auth/login", { username, password });
};

// 👤 Normal user
export const registerUser = (username, fullName, email, password) =>
  apiClient.post("/auth/register", {
    username,
    fullName,
    email,
    password,
  });

// 🛡️ Admin (NO JWT)
export const registerAdmin = (username, fullName, email, password) =>
  apiClient.post("/admin/users/register", {
    username,
    fullName,
    email,
    password,
  });
