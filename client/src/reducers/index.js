import { combineReducers } from "redux";
import postsReducer from "./posts";
import currentIDReducer from "./currentid";
import AuthReducer from "./auth";
export default combineReducers({
  postsReducer,
  currentIDReducer,
  auth: AuthReducer,
});
