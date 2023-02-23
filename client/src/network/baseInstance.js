import axios from "axios";

export const baseInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});
