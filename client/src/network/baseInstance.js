import axios from "axios";

export const baseInstance = axios.create({
  baseURL: "https://starfish-app-h9mfo.ondigitalocean.app/api",
});
