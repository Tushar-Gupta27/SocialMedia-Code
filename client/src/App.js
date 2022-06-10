import React, { useEffect } from "react";
import "./App.css";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Navbar from "./components/Navbar/Navbar";
import { Container } from "@mui/material";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PostDetails from "./components/PostDetails/PostDetails";
import { useSelector, useDispatch } from "react-redux";
function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    const tempUser = JSON.parse(localStorage.getItem("profile"));
    if (tempUser) {
      if (tempUser !== user) dispatch({ type: "AUTH", payload: tempUser });
    }
  }, [location]);
  return (
    <Container maxWidth="xl" sx={{ padding: "0 0 20px 0" }}>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Navigate to="/posts" />} />
        <Route path="/posts" element={<Home />} />
        <Route path="/posts/s" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route
          path="/auth"
          element={user ? <Navigate to="/posts" replace={true} /> : <Auth />}
        />
      </Routes>
    </Container>
  );
}

export default App;
