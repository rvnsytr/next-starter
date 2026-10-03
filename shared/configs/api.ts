export const API_HOST =
  process.env.NODE_ENV === "production"
    ? "https://api.yourdomain.com"
    : "http://localhost:8000";

export const API_BASE_PATH = "/api";

export const API_BASE_URL = `${API_HOST}${API_BASE_PATH}`;
