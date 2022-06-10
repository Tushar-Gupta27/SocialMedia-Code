import { AUTH } from "../constants/auth";
import axios from "axios";
//INSTANCE
const axiosAPI = axios.create({
  baseURL: "http://localhost:5000",
  headers: { Authorization: `Bearer` },
});
//INTERCEPTORS
axiosAPI.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const setAuthAction = (profile, token) => {
  return { type: AUTH, payload: { profile, token } };
};
export const logoutAction = () => {
  return { type: "LOGOUT" };
};

export const signInAction = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await axiosAPI.post("/user/signin", formData);
    dispatch({ type: AUTH, payload: data });
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};
export const signUpAction = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await axiosAPI.post("/user/signup", formData);
    dispatch({ type: AUTH, payload: data });
    navigate("/");
  } catch (error) {
    console.log(error.message);
  }
};
