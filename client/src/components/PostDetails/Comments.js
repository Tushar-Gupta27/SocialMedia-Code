import React, { useState, useEffect, useRef } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  CommentsOuterContainerStyles,
  CommentsInnerContainerStyles,
} from "./styles";
import { commentPostAction } from "../../actions/posts";
import { updatePost } from "../../API";

function Comments({ post }) {
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.auth);

  const commentsRef = useRef();
  useEffect(() => {
    commentsRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  useEffect(() => {
    commentsRef.current.parentNode.scrollTo({ top: 0 });
  }, []);

  // the useeffect defined later in the code always has the higher proiority of code being executed example can be seen above

  async function handleClick() {
    // getting the return from action and setting it as state provides a better UX as it doesnt show a loading
    const newComments = await dispatch(
      commentPostAction(`${user?.profile?.name}: ${comment}`, post._id)
    );
    setComments(newComments);
    setComment("");
  }
  // for some reason scrollIntoView only works in useEffect, so we can scroll when state updatePost, to avoid 1st render scroll we can add a useeffect that prevents scroll on first render

  return (
    <div>
      <div style={CommentsOuterContainerStyles}>
        <div className="specialScroll" style={CommentsInnerContainerStyles}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle2">
              <strong>{c.split(": ")[0]}:</strong> {c.split(": ")[1]}
            </Typography>
          ))}
          <div
            ref={commentsRef}
            style={{ scrollPadding: "0", scrollMargin: "0" }}
          />
        </div>
        {user && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="subtitle2">
              Write a Comment!
            </Typography>
            <TextField
              fullWidth
              rows={4}
              variant="outlined"
              multiline
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              disabled={!comment}
              variant="contained"
              onClick={handleClick}
              color="primary"
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comments;
