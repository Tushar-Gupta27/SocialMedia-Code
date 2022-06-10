import { AUTH, LOGOUT } from "../constants/auth";

const AuthReducer = (authData = null, action) => {
  switch (action.type) {
    case AUTH:
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
      return (authData = action?.payload);
    case LOGOUT:
      localStorage.removeItem("profile");
      return (authData = null);
    default:
      return authData;
  }
};
export default AuthReducer;
