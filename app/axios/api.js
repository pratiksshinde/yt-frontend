import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://aj343-yt-rag-backend.hf.space",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance; 