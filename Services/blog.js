'use strict';
import { query } from "express";
import Post from "../models/post.js";
import User from "../models/user.js";
class Blog {
    static async Followers(_id, _Fid) {
        const user = await User.findOne({ _id: _id });

        const byUserFollower = await User.findOne({ _id: _Fid })
        if (_id === user._id.toString()) {
            return {
                status: 400,
                data: null,
                message: "You can't follow yourself"
            }
        }
        const Exist = user?.followers?.includes(el => el.toString() === _Fid);
        if (Exist) {
            const response = await User.findOneAndUpdate(
                { _id: _id },
                { $pull: { followers: _Fid } },
                { new: true })

                ;
            return {
                status: 200,
                data: response,
                message: "Unfollow Successfully"
            }
        } else {
            const response = await User.findOneAndUpdate(
                { _id: _id },
                { $push: { followers: _Fid } },
                { new: true }
            );
            return {
                status: 200,
                data: response,
                message: "Followed Successfully"
            }
        }
    }
    static async CreateBlog(data) {
        const user = await User.findById(data.postedBy)
        let newPost
        if (!user) {
            return {
                status: 404,
                data: null,
                message: "User not found",
            }
        }
        if (data?.path === undefined) {
            newPost = await Post.create({
                postedBy: data?.postedBy,
                text: data?.text,
                img: data?.img,
                title: data?.title,
            })
        } else {
            newPost = await Post.create({
                postedBy: data?.postedBy,
                text: data?.text,
                img: data?.path,
                title: data?.title,
            })
        }
        return {
            status: newPost ? 201 : 500,
            success: newPost ? true : false,
            message: newPost ? "Blog Created Successfully" : "Post validation failed"
        }
    }
    static async GetBlog(pid, id) {
        const post = await Post.findById(pid)
        const check = post.approiver
        return {
            status: check === "Accepted" ? 200 : 500,
            data: check === "Accepted" ? post : "Post Pending",
        }
    }
    static async UserListPosts(_id) {
        const user = await User.findById(_id)
        if (!user) {
            return {
                status: 404, // User not found
                data: null,
                message: "User not found",
            }
        }
        const posts = await Post.find({
            postedBy: _id,
            approiver: "Accepted"
        }).select("title img ").sort({ createdAt: -1 });
        return {
            status: posts ? 200 : 500,
            data: posts ? posts : "U're not blog approved  or pending ",
            message: "Posts fetched Successfully"
        }
    }
    static async ApproveBlog(bid, check) {
        const checkStatus = await Post.findById(bid).select("approiver");
        if (checkStatus.approiver == "Accepted")
            throw new Error("The Post had Accepted ")
        let message = ""
        let data = null
        if (check == 1) {
            data = await Post.findByIdAndUpdate(
                bid,
                { $set: { approiver: "Accepted" } },
                { new: true })
            message = "Blog Accepted Successfully"
        }
        if (check == 2) {
            data = await Post.findByIDAndUpdate(
                bid,
                { $set: { approiver: "Rejected" } },
                { new: true })
            if (data) {
                await Post.findByIDAndDelete(pid)
            }

            message = "Blog Rejected Successfully"
        }
        return {
            status: data ? 200 : 500,
            message: data ? message : "failed"
        }
    }
    static async replyPost(data) {
        const post = await Post.findById(data.pid).select('-approiver')
        if (!post) {
            return {
                status: 404, // User not found
                data: null,
                message: "Post not found",
            }
        }
        const reply = {
            userId: data.userId,
            text: data.text,
            //   userProfilePic: data.userProfilePic||'',
            username: data.username,
        }
        post.replies.push(reply);
        await post.save();
        return {
            status: post ? 200 : 500,
            success: post ? true : false,
            message: post ? "comment successfully" : "invalid post",
            // data: post
        }
    }
    static async DeleteBlog(pid, id) {
        const postId = await Post.findById(pid)
        if (!postId)
            throw new Error("Post not found");
        const userId = await User.findById(id);
        if (userId.Role !== true || userId._id.toString() !== postId.postedBy.toString())
            throw new Error("You are not authorized to delete this post");
        const response = await Post.findByIdAndDelete(pid)
        return {
            status: response ? 200 : 500,
            success: response ? true : false,
            message: response ? "Blog Deleted Successfully" : false
        }
    }
    static async LikePost(pid, id) {
        const post = await Post.findById(pid);
        let like;
        if (!post)
            throw new Error("Post not found ")
        const Current = post?.likes?.find((el) => el.toString() === id)
        if (!Current) {
            like = await Post.findByIdAndUpdate(
                pid,
                { $push: { likes: id }, $inc: { totalLike: 1 } },
                { new: true }
            )

        } else {
            like = await Post.findByIdAndUpdate(
                pid,
                { $pull: { likes: id }, $inc: { totalLike: -1 } },
                { new: true }
            )
        }
        return {
            status: like ? 200 : 400,
            success: like ? true : false,
            message: like ? like.totalLike : "0"
        }
    }
    static async DetailPost(pid) {
        const post = await Post.findById(pid).
            select("-approiver -createdAt -updatedAt")
        if (!post) throw new Error("Post not Found ")
        return {
            status: post ? 200 : 401,
            message: post ? "success" : "Not Found ",
            data: post
        }
    }
    static async SearchPost(check) {
        const query = {
            $or: [
                { title: { $regex: check, $options: 'i' } },
            ]
        }
        const response = await Post.find(query).sort({ createdAt: -1 });
        console.log(response)
        return {
            status: response ? 200 : 401,
            message: response ? "success" : "Not Found ",
            data: response,
        }; // Added semicolon here
    }
    static async ListPost(Search) {
        let response
        if (Search) {
            const query = { title: { $regex: Search, $options: 'i' }, approiver: "Accepted" }
            response = await Post.find(query)
                .select('-approver')
                .sort({ createdAt: -1 });
        } else {
            response = await Post.find({ approiver: "Accepted" })
                .select('-approver')
                .sort({ createdAt: -1 });
        }
        return {

            status: response ? 200 : 401,
            message: response ? "success" : "Not Found ",
            data: response,
        }
    }
    static async UpdatePost(pid, title, text, path, img) {
        const post = await Post.findById(pid)
        if (!post) {
            return {
                status: 404, // User not found
                data: null,
                message: "Post not found",
            }
        }
        let response
        if (path === undefined) {
            response = await Post.findByIdAndUpdate(
                pid,
                { $set: { title, text, img } },
                { new: true }
            )
        }
        else {

            response = await Post.findByIdAndUpdate(
                pid,
                { $set: { title, text, img: path } },
                { new: true }
            )
        }
        return {
            status: response ? 200 : 500,
            success: response ? true : false,
            message: response ? "Blog Updated Successfully" : "invalid post"
        }
    }
    static async deleteReply(postId, replyId) {
        const post = await Post.findById(postId);
        if (!post) {
            return {
                status: 404,
              success: false,
                message: "Không tìm thấy bài đăng",
            };
        }
        const CurrentCmt = post?.replies?.find(el => el._id.toString() === replyId)
        if (!CurrentCmt) {
            return {
                status: 404,
              success: false,
                message: "Không tìm thấy phản hồi",
            };
        }
        else {
            await Post.updateOne({
                replies: { $elemMatch: CurrentCmt }
            }, {
                $pull:
                {
                    replies:
                        { _id: replyId }
                }
            })
            return {
                status: 200,
                success: post ? true : false,
                message: post ? "Phản hồi đã được xóa thành công" : "Error",

            };
        }


    }

}
export default Blog