import axios from "axios";
const BASE_URL = "http://localhost:3001/books";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
