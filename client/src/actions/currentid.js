import { SETID } from "../constants/actionTypes";
export const setIDAction = (id) => {
  return { type: SETID, payload: id };
};
