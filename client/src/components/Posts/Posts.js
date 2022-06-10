import React from "react";
import Post from "./Post/Post";
import { useSelector } from "react-redux";
import { Grid, CircularProgress } from "@mui/material";

function Posts() {
  const { posts, isLoading } = useSelector((state) => state.postsReducer);
  if (posts.length === 0 && !isLoading) return "No posts";
  return !isLoading ? (
    <Grid container alignItems="stretch" spacing={3}>
      {posts?.map((post) => (
        <Grid key={post._id} item xs={12} sm={6} md={6} lg={3}>
          <Post postItem={post} />
        </Grid>
      ))}
    </Grid>
  ) : (
    <CircularProgress thickness={4} size={50} />
  );
}

export default Posts;
