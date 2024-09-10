import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			minLength: 6,
			required: true,
		},
		profilePic: {
			type: String,
			default: "",
		},
		followers: {
			type: [String],
			default: [],
		},
		following: {
			type: [String],
			default: [],
		},
		// bio: {
		// 	type: String,
		// 	default: "",
		// },
		isFrozen: { //  block account
			type: Boolean,
			default: false,
		},
		Count:{
			type: Number,
            default: 0
		},
		Role: {
			type: Boolean,
			default: false
		},
		RefreshToken: {
			type: String,
		},
		lockUntil: { 
			type: Date 
		}
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
})

userSchema.methods.comparePassword =async function(password) {
	return  bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;