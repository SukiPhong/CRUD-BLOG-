import mongoose from "mongoose";

const postSchema = mongoose.Schema(
	{
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title:{
			type:String,
			required: true,
            trim: true,
            maxLength: 100,
		},
		text: {
			type: String,
			maxLength: 2000,
		},
		img: {
			//type: [],
			type:String,
		},
		likes: {
			// array of user ids
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		totalLike:{
			type:Number,
            default:0,
		},
		approiver:{
			type:String,
			enum:['Pending', 'Accepted', 'Rejected'],
			default:'Accepted'
		},
		replies: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				userProfilePic: {
					type: String,
				},
				username: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);

export default Post;