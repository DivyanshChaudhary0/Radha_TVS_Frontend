import axiosInstance from "./axiosInstance";

export const dashboardApi = {
  // Dashboard statistics
  getStatics: async () => {
    const response = await axiosInstance.get(`/api/dashboard/stats`);
    return response.data;
  },

  // Sales overview
  getSalesOverview: async (period: "weekly" | "monthly" | "yearly") => {
    const response = await axiosInstance.get(`/api/dashboard/sales-overview`, {
      params: { period },
    });
    return response.data;
  },

  // Top selling bikes
  getTopSellingBikes: async (limit = 5) => {
    const response = await axiosInstance.get(`/api/dashboard/top-bikes`, {
      params: { limit },
    });
    return response.data;
  },

  // Revenue statistics
  getRevenueStats: async () => {
    const response = await axiosInstance.get(`/api/dashboard/revenue`);
    return response.data;
  },
};
