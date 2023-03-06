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
        if (err.response?.status == 401) {
          localStorage.removeItem("user");
          window.location.href = "/";
        }
        throw err;
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
  update: async (url, data) => {
    let token = localStorage.getItem("token");
    let response = {};
    await baseInstance
      .put(url, data, {
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
  createPost: async (url, data) => {
    let token = localStorage.getItem("token");
    let response = {};
    await baseInstance
      .post(url, data, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
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
  delete: async (url) => {
    let token = localStorage.getItem("token");
    let response = {};
    await baseInstance
      .delete(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        response = res;
      })
      .catch((err) => {
        throw err;
      });
    return response;
  },
};
