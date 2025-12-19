import apiClient from "./apiClient";

export const getAdminMetrics = () =>
  apiClient.get("/admin/dashboard/metrics");
