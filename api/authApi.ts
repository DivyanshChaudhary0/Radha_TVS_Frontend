
import axiosInstance from "./axiosInstance";

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });
    return res.data;
  },
  verifyToken: async () => {
    const res = await axiosInstance.get("/");
    return res.data;
  },
};
