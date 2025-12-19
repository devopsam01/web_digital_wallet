import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const setAuthToken = (token) => {
  if (token) {
    console.log("Setting auth token:", token); 
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("Removing auth token"); 
    // Ensure the header is correctly removed!
    delete apiClient.defaults.headers.common["Authorization"]; 
  }
};

// ...


// Optional: intercept requests for logging
apiClient.interceptors.request.use((config) => {
  console.log("API Request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;
