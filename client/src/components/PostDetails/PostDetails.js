import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import {
  CardStyles,
  MediaStyles,
  SectionStyles,
  ImageSectionStyles,
  RecommendedPostsStyles,
  LoadingPaperStyles,
} from "./styles";
import { getPostAction, getPostsBySearchAction } from "../../actions/posts";
import Comments from "./Comments";

function PostDetails() {
  const { post, posts, isLoading } = useSelector((state) => state.postsReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const mediaMatches = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    dispatch(getPostAction(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (post)
      dispatch(
        getPostsBySearchAction({ search: "none", tags: post?.tags.join(",") })
      );
  }, [post]);

  function openPost(id) {
    navigate(`/posts/${id}`);
  }
  const recommendedPosts = posts?.filter((post) => post._id !== id);

  if (!post) return <div>No POST</div>;
  if (isLoading)
    return (
      <Paper elevation={6} sx={LoadingPaperStyles}>
        <CircularProgress size="7em" />
      </Paper>
    );
  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div
        style={{
          ...CardStyles,
          flexWrap: mediaMatches ? "wrap" : "nowrap",
          flexDirection: mediaMatches ? "column" : "row",
        }}
      >
        <div style={SectionStyles}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="body1">
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <Comments post={post} />
          <Divider style={{ margin: "20px 0" }} />
        </div>
        <div
          style={{
            ...ImageSectionStyles,
            marginLeft: mediaMatches ? "0" : "20px",
          }}
        >
          <img
            style={MediaStyles}
            src={
              post.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={post.title}
          />
        </div>
      </div>
      {recommendedPosts.length !== 0 && (
        <div style={SectionStyles}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider />
          <div
            style={{
              ...RecommendedPostsStyles,
              flexDirection: mediaMatches ? "column" : "row",
            }}
          >
            {recommendedPosts.map(
              ({ title, message, name, likes, selectedFile, _id }) => (
                <div
                  style={{ margin: "20px", cursor: "pointer" }}
                  onClick={() => openPost(_id)}
                  key={_id}
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {message}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    Likes: {likes.length}
                  </Typography>
                  <img src={selectedFile} width="200px" alt={title} />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  );
}

export default PostDetails;
