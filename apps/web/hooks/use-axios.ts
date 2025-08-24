import axios from "axios";

export const useAxios = axios.create({
  // baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  // baseURL: "http://localhost:7000",
  baseURL:
    "https://rnibazw2kp5t4pmg53dagphpv40wrjsg.lambda-url.ap-south-1.on.aws",
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
