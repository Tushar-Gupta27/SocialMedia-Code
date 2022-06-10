import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Container,
  Grow,
  Grid,
  Paper,
  AppBar,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import ChipInput from "material-ui-chip-input";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { getPostsAction, getPostsBySearchAction } from "../../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import Paginate from "../Paginate";
import {
  Navigate,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppBarStyles } from "./styles";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //currentID in array as when we update it should re-GetPosts
  const currentID = useSelector((state) => state.currentIDReducer);
  const mediaMatches = useMediaQuery("(max-width:600px)");
  const [searchParams] = useSearchParams();
  var page = searchParams.get("page") || 1;
  const searchQuery = searchParams.get("searchQuery");
  //STATES
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);

  //EFFECTS
  useLayoutEffect(() => {
    if (location.search && location.pathname === "/posts/s") {
      searchPost();
    } else if (location.pathname === "/posts") {
      setSearch("");
      setTags([]);
    }
  }, [location.search, currentID, location.pathname]);

  //FUNCTIONS
  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      searchPost();
    }
  }
  function handleAdd(tag) {
    setTags((prev) => [...prev, String(tag)]);
  }
  function handleDelete(tagToDelete) {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  }
  function searchPost() {
    if (search.trim() || tags.length !== 0 || location.search) {
      if (search.trim() || tags.length !== 0) {
        dispatch(getPostsBySearchAction({ search, tags: tags.join(",") }));
        navigate(`/posts/s?searchQuery=${search}&tags=${tags.join(",")}`);
      } else if (location.search && location.pathname === "/posts/s") {
        dispatch(
          getPostsBySearchAction({
            search: searchParams.get("searchQuery"),
            tags: searchParams.get("tags"),
          })
        );
      }
    } else {
      navigate("/posts");
    }
  }

  //RETURN
  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
          direction={mediaMatches ? "column-reverse" : "row"}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar sx={AppBarStyles} position="static" color="inherit">
              <TextField
                name="search"
                variant="outlined"
                label="Search Memories"
                fullWidth
                onKeyDown={handleKeyDown}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <ChipInput
                style={{ margin: "10px 0" }}
                value={tags}
                onAdd={handleAdd}
                onDelete={handleDelete}
                label="Search Tags"
                variant="outlined"
              />
              <Button color="primary" variant="contained" onClick={searchPost}>
                Search
              </Button>
            </AppBar>
            <Form />
            {location.pathname !== "/posts/s" ? (
              <Paper elevation={6}>
                <Paginate page={page} />
              </Paper>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
}

export default Home;
