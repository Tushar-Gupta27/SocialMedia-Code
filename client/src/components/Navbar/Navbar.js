import React, { useState, useEffect } from "react";
import { Button, AppBar, Avatar, Toolbar, Typography } from "@mui/material";
import memories from "../../images/memories.png";
import {
  AppBarStyles,
  HeadingStyles,
  ImageSyles,
  BrandContainerStyles,
  ToolbarStyles,
  ProfileStyles,
  PurpleStyles,
  UserNameStyles,
} from "./styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) handleLogout();
    }
    //in decoded token exp and iat are in seconds values of time where iat is created time and exp is expiration tim
  }, [location]);

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    navigate("/posts");
  }

  return (
    <AppBar sx={AppBarStyles} position="static" color="inherit">
      <div style={BrandContainerStyles}>
        <img style={ImageSyles} src={memories} alt="memories" />
        <Typography
          component={Link}
          to="/posts"
          sx={HeadingStyles}
          variant="h2"
          align="center"
        >
          Memories
        </Typography>
      </div>
      <Toolbar sx={ToolbarStyles}>
        {user ? (
          <div style={ProfileStyles}>
            <Avatar
              sx={PurpleStyles}
              alt={user?.profile?.name}
              src={user?.profile?.imageUrl}
            >
              {user?.profile?.name.charAt(0)}
            </Avatar>
            <Typography sx={UserNameStyles} variant="h6">
              {user?.profile?.name}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/auth"
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
