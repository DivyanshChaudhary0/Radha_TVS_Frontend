import axiosInstance from "./axiosInstance";

export const customerApi = {
  getAllCustomers: async () => {
    const res = await axiosInstance.get("/api/customers");
    return res.data;
  },
  addCustomer: async (payload: any) => {
    const res = await axiosInstance.post("/api/customers", payload);
    return res.data;
  },
  editCustomer: async (id: string, payload: any) => {
    const res = await axiosInstance.put(`/api/customers/${id}`, payload);
    return res.data;
  },
  deleteCustomer: async (id: string) => {
    const res = await axiosInstance.delete(`/api/customers/${id}`);
    return res.data;
  },
};
