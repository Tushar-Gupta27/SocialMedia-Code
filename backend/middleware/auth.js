import jwt, { decode } from "jsonwebtoken";
//MIDDLEWARE

//user wants to like a post => user clicks on like => we get a req on '/:id/likePost => now as we have middleware we receive the request here first ==> once verified it gives req.userId to postController
// See req.headers

const auth = async (req, res, next) => {
  try {
    //token that was generated during sigin as we send it through the middleware then the main function/controller
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    //googleOAuth token >500
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test"); //secret key
      // returns the decoded data that are id and email in this case
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
      //sub is a way or kind of ID given by GoogleOAuth
    }
    next();
    //go to the main routeController function
  } catch (error) {
    console.log(error); //if the token is invalid or expired
  }
};

export default auth;
