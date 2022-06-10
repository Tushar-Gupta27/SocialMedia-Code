import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import FileBase64 from "react-file-base64";
import {
  FileInputStyles,
  PaperStyles,
  ButtonSubmitStyles,
  FormStyles,
  TextFieldStyles,
} from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction, updatePostAction } from "../../actions/posts";
import { useNavigate } from "react-router-dom";

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [show, setShow] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const currentID = useSelector((state) => state.currentIDReducer);
  const post = useSelector((state) =>
    currentID
      ? state.postsReducer.posts.find((p) => (p._id === currentID ? p : null))
      : null
  );
  const user = useSelector((state) => state.auth);
  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  function handleSubmit(e) {
    //passing on navigate to navigate to newly updated or created post to open
    e.preventDefault();
    for (const [key, value] of Object.entries(postData)) {
      if (value === "") error.push(key[0].toUpperCase() + key.slice(1));
    }
    if (error.length !== 0) {
      setShow(true);
    } else {
      if (currentID) {
        dispatch(
          updatePostAction(
            currentID,
            { ...postData, name: user?.profile.name },
            navigate
          )
        );
        clear();
      } else {
        dispatch(
          createPostAction({ ...postData, name: user?.profile.name }, navigate)
        );
        clear();
      }
    }
  }
  function handleChange(e) {
    show && setShow(false); //so that only on true it changes it to false
    show && setError([]);
    const { name, value } = e.target;
    setPostData((prev) => {
      return { ...prev, [name]: value };
    });
    if (name === "tags")
      setPostData((prev) => ({ ...prev, tags: value.split(",") }));
  }
  function clear() {
    dispatch({ type: "RESETID" });
    show && setShow(false);
    show && setError([]);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  }

  if (!user?.profile?.name) {
    return (
      <Paper sx={PaperStyles}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={PaperStyles}>
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        style={FormStyles}
      >
        <Typography variant="h6">
          {currentID ? "Editing" : "Creating"} a Memory
        </Typography>
        <TextField
          sx={TextFieldStyles}
          style={TextFieldStyles}
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={handleChange}
        />
        <TextField
          sx={TextFieldStyles}
          style={TextFieldStyles}
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          value={postData.message}
          onChange={handleChange}
          multiline
          rows={4}
        />
        <TextField
          sx={TextFieldStyles}
          style={TextFieldStyles}
          name="tags"
          variant="outlined"
          label="Tags (separated by commas)"
          fullWidth
          value={postData.tags}
          onChange={handleChange}
        />
        <div style={FileInputStyles}>
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData((prev) => {
                return { ...prev, selectedFile: base64 };
              })
            }
          />
        </div>
        {show ? (
          <Typography
            variant="h6"
            sx={{ color: "red", fontSize: "10px", padding: "4px" }}
          >{`Message: ${error.join(",")} can't be empty`}</Typography>
        ) : null}

        <Button
          type="submit"
          color="primary"
          variant="contained"
          size="large"
          sx={ButtonSubmitStyles}
          fullWidth
        >
          Submit
        </Button>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
}

export default Form;
