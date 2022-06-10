import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Button,
  Typography,
  ButtonBase,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  CardStyles,
  MediaStyles,
  OverlayStyles,
  Overlay2Styles,
  DetailsStyles,
  CardActionStyles,
  CardContentStyles,
  TitleStyles,
} from "./styles";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setIDAction } from "../../../actions/currentid";
import { deletePostAction, likePostAction } from "../../../actions/posts";
import Like from "./Like";
import { useNavigate, Link } from "react-router-dom";

function Post({ postItem }) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(postItem?.likes);
  const user = useSelector((state) => state.auth);

  const userIdCheck = user?.profile?._id || user?.profile?.googleId;
  const hasLiked = postItem.likes.find((id) => id === userIdCheck);
  function openPost() {
    navigate(`/posts/${postItem._id}`);
  }
  function handleLike() {
    //doing this to create an instant response for user, while the backend updates while taking its time
    dispatch(likePostAction(postItem._id));
    if (hasLiked) {
      setLikes(likes.filter((id) => id !== userIdCheck));
    } else {
      setLikes([...likes, userIdCheck]);
    }
  }

  const dispatch = useDispatch();
  return (
    <Card sx={CardStyles} raised elevation={3}>
      <div style={{ cursor: "pointer" }} onClick={openPost}>
        <CardMedia
          sx={MediaStyles}
          image={postItem.selectedFile}
          title={postItem.title}
        />
        <div style={OverlayStyles}>
          <Typography variant="h6">{postItem.name}</Typography>
          <Typography variant="body2">
            {moment(postItem.createdAt).fromNow()}
          </Typography>
        </div>
        {postItem.creator ===
          (user?.profile?.googleId || user?.profile?._id) && (
          <div style={Overlay2Styles}>
            <Button
              sx={{ color: "white" }}
              size="small"
              onClick={() => {}}
              title="Edit Post"
            >
              <MoreHorizIcon
                size="small"
                onClick={() => {
                  dispatch(setIDAction(postItem._id));
                }}
              />
            </Button>
          </div>
        )}
        <div style={DetailsStyles}>
          <Typography variant="body2" color="textSecondary">
            {postItem.tags.map((tag) => `#${tag} `)}
          </Typography>
        </div>
        <Typography sx={TitleStyles} variant="h5">
          {postItem.title}
        </Typography>
        <CardContent sx={CardContentStyles}>
          <Typography variant="body2" color="textSecondary" component="p">
            {`${postItem.message.substring(0, 40)}${
              postItem.message.length <= 40 ? "" : "..."
            }`}
          </Typography>
        </CardContent>
      </div>
      <CardActions sx={CardActionStyles}>
        <Button
          size="small"
          color="primary"
          onClick={handleLike}
          disabled={!user?.profile}
        >
          <Like likes={likes} />
        </Button>
        {postItem.creator ===
          (user?.profile?.googleId || user?.profile?._id) && (
          <Button
            size="small"
            color="primary"
            onClick={() => {
              dispatch(deletePostAction(postItem._id));
            }}
          >
            <DeleteIcon fontSize="small" />
            &nbsp;Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Post;
