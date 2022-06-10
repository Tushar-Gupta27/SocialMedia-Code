import mongoose from "mongoose";
import Posts from "../models/postModel.js";

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No post with that ID");
    const result = await Posts.findById(id);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async (req, res) => {
  const page = req.query.page || 1;
  try {
    const limit = 8;
    //startindex to know which post will start from which index
    const startIndex = (Number(page) - 1) * limit;
    const total = await Posts.countDocuments({});
    const posts = await Posts.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);
    // {_id:-1} sorts by newest to oldest
    res.status(200).json({
      posts: posts,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//QUERY -> /posts?page=1 -> page=1
//PARAMS -> /posts/123 -> id=123

export const searchPosts = async (req, res) => {
  const searchQuery = req.query.searchQuery;
  const tags = req.query.tags;
  try {
    const title = new RegExp(searchQuery, "i"); //i=> ignoreCase
    const tagsArr = tags.split(",").map((tag) => String(tag));
    const posts = await Posts.find({
      $or: [{ title }, { tags: { $in: tagsArr } }],
    });
    //USING REGEX $or: [{ title: { $regex: title } }, { tags: { $in: tags.split(",") } }],

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
};
export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Posts({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  // now the creator wont be the name it will be the ID
  //name will be the name
  try {
    //model.save is always a async function always use await or .then
    //see exact HTTPCodes {https://www.restapitutorial.com/httpstatuscodes.html}
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { creator, title, message, selectedFile, tags } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that ID");

  //the step below is not necessary and we can give normal posts in update method too
  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
  await Posts.findByIdAndUpdate(id, updatedPost, { new: true });
  res.status(200).json(updatedPost);
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that ID");
  await Posts.findByIdAndRemove(id);
  res.json({ message: "Post deleted Successfully" });
};

export const likePost = async (req, res) => {
  const id = req.params.id;
  if (!req.userId) return res.json({ message: "UnAuthenticated" });
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No post with that ID");
  }
  const post = await Posts.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    //like the post
    post.likes.push(String(req.userId));
  } else {
    //dislike the post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  //we update the post not only the likes by +1
  const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });
  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;

  const post = await Posts.findById(id);
  post.comments.push(comment);
  const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true });
  //this new:true returns the updated object
  res.status(201).json(updatedPost);
};
