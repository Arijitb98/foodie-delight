import Axios from "axios";

function createAxios() {
  const axios = Axios.create();

  axios.defaults.baseURL = `${process.env.REACT_APP_API_BASEURL}`;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.timeout = 120000; // 2 minutes

  return axios;
}

const api = createAxios();

const service = {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
};

export default service;