import axios from "axios";

export const apiClient = axios.create({
  // should be in an env variable
  baseURL: "https://78hajbm44f.execute-api.eu-west-1.amazonaws.com/dev",
});
