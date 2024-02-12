import axios from "axios";
const BASE_URL = "http://localhost:3001";

// base axios instance

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
