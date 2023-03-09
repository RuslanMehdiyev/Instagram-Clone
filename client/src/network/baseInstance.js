import axios from "axios";

export const baseInstance = axios.create({
  baseURL: "https://blooming-headland-23532.herokuapp.com/api",
});
