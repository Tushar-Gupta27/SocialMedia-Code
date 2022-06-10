import { SETID } from "../constants/actionTypes";

const currentIDReducer = (current = null, action) => {
  switch (action.type) {
    case SETID:
      return action.payload;
    case "RESETID": {
      return null;
    }
    default:
      return current;
  }
};

export default currentIDReducer;
