'use strict';
import asyncHandler from "express-async-handler"
import Blog from "../Services/blog.js"
const Post = {
  createBlog: asyncHandler(async (req, res) => {
    const { title, text,img } = req.body
    const postedBy = req.user.id
    //const path = req?.files?.path?.map(el=>el.path)
    const path = req?.file?.path
    if (!postedBy || !text)
      throw new Error("Invalid")
    const data = { text, postedBy, path, title,img }
    const newPost = await Blog.CreateBlog(data)
    return res.status(newPost.status).json({
      success: newPost.success,
      message: newPost.message
    })
  }),
  getBlog: asyncHandler(async (req, res) => {
    const postID = req.params.id
    if(!postID) throw new Error("There are no matching articles")
    const response = await Blog.GetBlog(postID);
    return res.status(response.status).json({
      message: response.message,
      data: response.data
    })
  }),
  getUserListPosts: asyncHandler(async (req, res) => {
    const { id } = req.user
    const response = await Blog.UserListPosts(id);
    res.status(response.status).json({
      message: response.message,
      data: response.data
    });

  }),
  ApproveBlog: asyncHandler(async (req, res) => {
    const { bid } = req.params
    const { check } = req.body
    const admin = req.user
    if (admin.Role !== true)
      throw new Error("You not allowed to access this blog")
    const response = await Blog.ApproveBlog(bid, check)
    return res.status(response.status).json({
      message: response.message,
      data: response.data
    })
  }),
  replyToPost: asyncHandler(async (req, res) => {
    const { text } = req.body;
    const { pid } = req.params;
    const userId = req.user.id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    const data ={text,pid,userId,userProfilePic,username}
    if (!text)
      throw new Error("Text field is required")
    const response = await Blog.replyPost(data)
    return res.status(response.status).json({
      success: response.success,
      message: response.message,
    //  data: response.data
    })
  }),
  deletePost: asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { id } = req.user;
    const response = await Blog.DeleteBlog(pid, id)
    return res.status(response.status).json({
      success: response.success,
      message: response.message
    })
  }),
  likePost: asyncHandler(async (req, res) => {
    const { pid } = req.params
    const { id } = req.user
    if (!pid || !id) throw new Error("Errors")
    const response = await Blog.LikePost(pid, id)
    return res.status(response.status).json({
      success: response.success,
      message: response.message
    })
  }),
  showDetailPost: asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid) throw new Error("Missing input")
    const response = await Blog.DetailPost(pid);
    return res.status(response.status).json({
      message: response.message,
      data: response.data
    })
  }),
  SearchPost: asyncHandler(async (req, res) => {
    const check = req.query.check
    const response = await Blog.SearchPost(check)
    return res.status(response.status).json({
      message: response.message,
      data: response.data
    })
}) ,
  ListPost: asyncHandler(async (req, res) => {
    const Search =  req.query.Search;
    const response = await Blog.ListPost(Search);
    return res.status(response.status).json({
      message: response.message,
      data: response.data
    })
  }),
  updatePost:asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { title, text ,img} = req.body;
    if(req?.file?.path)
      {var path = req?.file?.path}
    const response = await Blog.UpdatePost(pid, title, text, path,img);
    return res.status(response.status).json({
      success: response.success,
      message: response.message,
    })
  }),
  deleteCMT:asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const {replyId} = req.query;
    const response = await Blog.deleteReply(pid, replyId);
    return res.status(response.status).json({
      success: response.success,
      message: response.message,
    })
  })
}
export default Post