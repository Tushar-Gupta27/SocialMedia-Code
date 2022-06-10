import axios from "axios";
import * as api from "../API/index";
import {
  CREATE,
  UPDATE,
  DELETE,
  FETCH,
  FETCH_SEARCH,
  START_LOADING,
  END_LOADING,
  FETCH_POST,
  COMMENT,
  LIKE,
} from "../constants/actionTypes";

const axiosAPI = axios.create({ baseURL: "http://localhost:5000" });
axiosAPI.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});
//all async actions from API are taken care in action not in reducers
//thunk allows us to make async action, below is the syntax
export const getPostsAction = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPosts(page);
    dispatch({ type: FETCH, payload: data });
    dispatch({ type: END_LOADING });
  } catch (err) {
    console.log(err.message);
  }
};

export const getPostsBySearchAction = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await axiosAPI.get(
      `/posts/s?searchQuery=${searchQuery.search || "none"}&tags=${
        searchQuery.tags
      }`
    );
    dispatch({ type: FETCH_SEARCH, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getPostAction = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await axios.get(`http://localhost:5000/posts/${id}`);
    dispatch({ type: FETCH_POST, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createPostAction = (post, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);
    navigate(`/posts/${data._id}`);
    dispatch({ type: CREATE, payload: data });
    dispatch({ type: END_LOADING });
  } catch (err) {
    console.log(err);
  }
};

export const updatePostAction =
  (id, updatedPost, navigate) => async (dispatch) => {
    try {
      const { data } = await api.updatePost(id, updatedPost);
      navigate(`/posts/${data._id}`);
      dispatch({ type: UPDATE, payload: data });
    } catch (err) {
      console.log(err);
    }
  };

export const deletePostAction = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const likePostAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const commentPostAction = (comment, id) => async (dispatch) => {
  try {
    const { data } = await api.commentPost(comment, id);
    dispatch({ type: COMMENT, payload: data });
    return data.comments;
  } catch (error) {
    console.log(error);
  }
};
