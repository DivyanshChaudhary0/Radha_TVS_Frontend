
import axiosInstance from "./axiosInstance";

export const getStockSummary = async (token: string) => {
  const res = await axiosInstance.get("/api/bikes/stock", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getBikeSummary = async (token: string) => {
  const res = await axiosInstance.get("/api/bikes/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const bikeApi = {
  getAll: async () => {
    const res = await axiosInstance.get("/api/bikes");
    return res.data;
  },
  createBike: async (payload: any) => {
    const res = await axiosInstance.post("/api/bikes", payload);
    return res.data;
  },

  updateBike: async (id: string, payload: any ) => {
    const res = await axiosInstance.put(`/api/bikes/${id}`, payload);
    return res.data;
  },

  deleteBike: async (id: string) => {
    const res = await axiosInstance.delete(`/api/bikes/${id}`);
    return res.data;
  },
};
