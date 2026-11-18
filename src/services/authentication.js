import { apiRequest } from "./api";

export const login = (correo, password) =>
  apiRequest("/authentication/login", null, {
    method: "POST",
    body: JSON.stringify({ correo, password })
  });

export const getCurrentUser = (accessToken) =>
  apiRequest("/authentication/me", accessToken);

export const logout = (accessToken, refreshToken) =>
  apiRequest("/authentication/logout", accessToken, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken })
  });
