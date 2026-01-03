import axiosInstance from "./axiosInstance";

export const saleApi = {
  createSale: async (payload: any) => {
    const res = await axiosInstance.post("/api/sales", payload);
    return res.data;
  },

  getSalesByCustomerId: async (id: string) => {
    const res = await axiosInstance.get(`/api/sales/${id}`);
    return res.data;
  },

  getAll: async () => {
    const res = await axiosInstance.get(`/api/sales/`);
    return res.data;
  },

  getStatics: async () => {
    console.log("Inside getStatics");
    const res = await axiosInstance.get(`/api/sales/dashboard`);
    return res.data;
  },
};
