import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  creator: String,
  name: String,
  tags: [String],
  selectedFile: String, //using base64
  likes: {
    //need every users ID who has liked the post
    type: [String],
    default: [],
  },
  comments: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Posts = mongoose.model("Posts", postSchema);

export default Posts;
