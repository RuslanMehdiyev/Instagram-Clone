import { baseInstance } from "./baseInstance";

export const api = {
  getAll: async (url) => {
    let token = localStorage.getItem("token");
    let response = [];
    await baseInstance
      .get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        if (err.response.status == 401) window.location.href = "/";
      });
    return response;
  },
  add: async (url, data) => {
    let token = localStorage.getItem("token");
    let response = {};
    await baseInstance
      .post(url, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        throw err;
      });
    return response;
  },
};
