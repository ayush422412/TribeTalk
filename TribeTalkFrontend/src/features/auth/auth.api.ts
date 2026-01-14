import {api }from "../../utils/api"
import type AuthResponse from "./auth.types"

export const authApi = {
  register: (data: {
    username: string
    email: string
    password: string
  }) =>
    api.post<AuthResponse>("/users/register", data),

  login: (data: {
    email: string
    password: string
  }) =>
    api.post<AuthResponse>("/users/login", data),

  logout: () =>
    api.post("/users/logout"),

  refreshToken: () =>
    api.post<{ accessToken: string }>("/users/refresh-token"),

  getCurrentUser: () =>
    api.get<AuthResponse["user"]>("/users/current-user"),
}

