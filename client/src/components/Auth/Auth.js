import { gapi } from "gapi-script";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  Grow,
} from "@mui/material";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import {
  PaperStyles,
  GoogleButtonStyles,
  FormStyles,
  AvatarStyles,
  SubmitStyles,
} from "./styles";
import Input from "./Input";
import Icon from "./Icon";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { setAuthAction, signInAction, signUpAction } from "../../actions/auth";
import { useNavigate } from "react-router-dom";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //The GAPI script solution for Google OAuth2.0
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "216251253364-49oq9ibujlr5ladqimvrpd0g3cqgco0r.apps.googleusercontent.com",
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const [signData, setSignData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (isSignup) {
      dispatch(signUpAction(signData, navigate));
    } else {
      dispatch(signInAction(signData, navigate));
    }
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setSignData((prev) => ({ ...prev, [name]: value }));
  }
  function handleShowPassword() {
    setShowPassword(!showPassword);
  }
  function switchMode() {
    setIsSignup(!isSignup);
  }

  async function googleSuccess(response) {
    const profile = response?.profileObj;
    const token = response?.tokenId;
    try {
      dispatch(setAuthAction(profile, token));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  function googleError(err) {
    console.log(err);
    console.log("Google sign in was unsuccessful. Try Again Later");
  }

  return (
    <Container component="main" maxWidth="xs">
      <Grow in>
        <Paper sx={PaperStyles} elevation={3}>
          <Avatar sx={AvatarStyles}>
            <LockOpenOutlinedIcon />
          </Avatar>
          <Typography variant="h5">{isSignup ? "SignUp" : "SignIn"}</Typography>
          <form style={FormStyles} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Input
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    half
                    value={signData.firstName}
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    handleChange={handleChange}
                    value={signData.lastName}
                    half
                  />
                </>
              )}
              <Input
                name="email"
                label="Email Address"
                handleChange={handleChange}
                value={signData.email}
                type="email"
              />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
                value={signData.password}
              />
              {isSignup && (
                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  handleChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  value={signData.confirmPassword}
                />
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={SubmitStyles}
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
            <GoogleLogin
              clientId="216251253364-49oq9ibujlr5ladqimvrpd0g3cqgco0r.apps.googleusercontent.com"
              render={(renderProps) => (
                <Button
                  sx={GoogleButtonStyles}
                  color="primary"
                  fullWidth
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  startIcon={<Icon />}
                  variant="contained"
                >
                  Google Sign In
                </Button>
              )}
              onSuccess={googleSuccess}
              onFailure={googleError}
              cookiePolicy="single_host_origin"
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grow>
    </Container>
  );
}

export default Auth;
