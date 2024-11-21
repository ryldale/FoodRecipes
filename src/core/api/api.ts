import { getCookie } from "@/shared/utils/cookie_handler";
import axios from "axios";

const apiServerEnv = {
  local: "http://localhost:8080/",
  dev: "https://mydb-beta.vercel.app/",
};

export const baseURL = apiServerEnv.dev;

export const api = {
  login: "/api/users/login",
  register: "/api/users/register",
  countries: "/api/countries",
  profile: "/api/users/profile",

  create: "/api/users/data/create",
  read: "/api/users/data",
  update: "/api/users/update",
  updateData: "/api/users/data/update",
  delete: "/api/users/data/delete",
};

const AuthToken = () => {
  if (typeof window !== "undefined") {
    const token = getCookie("authToken");
    
    return token;
  }
  return null;
};

export const serverAPI = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: AuthToken() ? `Bearer ${AuthToken()}` : null,
  },
  withCredentials: true,
});
