import axios from "axios";

//creating an instance of axios for easy access and clean code
const axiosAPI = axios.create({ baseURL: "http://localhost:5000" });
axiosAPI.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

//when we are sending a query that will be handled by the pathname controller only
export const fetchPosts = (page) => axiosAPI.get(`/posts?page=${page}`);

export const fetchPostsBySearch = (searchQuery) => {
  axiosAPI.get(
    `/posts/s?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );
};
export const fetchPost = (id) => {
  axiosAPI.get(`/posts/${id}`);
};

export const createPost = (newPost) => axiosAPI.post("/posts", newPost);

export const updatePost = (id, updatedPost) =>
  axiosAPI.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => axiosAPI.delete(`/posts/${id}`);

export const likePost = (id) => axiosAPI.patch(`/posts/${id}/likePost`);

export const commentPost = (comment, id) =>
  axiosAPI.post(`/posts/${id}/commentPost`, { comment });

//AUTH

//FOR SOME REASON THROUGH API ITS NOT WORKING

export const signInUser = (formData) => {
  axiosAPI.post("/user/signin", formData);
};
export const signUpUser = (formData) => {
  axiosAPI.post("/user/signup", formData);
};
