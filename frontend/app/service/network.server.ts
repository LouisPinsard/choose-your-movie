import axios from "axios";

export const apiClient = axios.create({
  // should be in an env variable
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  // eslint-disable-next-line
  baseURL: process.env?.BASE_API_URL,
});
