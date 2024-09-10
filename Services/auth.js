'use strict';
import User from '../models/user.js';
import {
    AccessToken,
    RefreshToken
}
    from '../Middleware/jwt.js'
import token_Email from '../utils/token_Email.js';
class UserActions {
    static async register(email, username, password, confirm_password) {
        const existEmail = await User.findOne({ email });
        if (existEmail) throw new Error('Email already exist');
        if (confirm_password != password)throw new Error('Password do not match');
        const newUser = await User.create({
            email,
            password,
            username,
        });
        const { password: _, refreshToken: __, isFrozen: ___, Role: ____, ...others } = newUser.toObject();
        return {
            status: newUser ? 201 : 500,
            body: {
                success: newUser ? true : false,
                message: newUser ? 'User created successfully' : 'Something went wrong',
                data: others
            }
        }
    }

    static async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');
        if (user.isFrozen) {// true
            if (user.lockUntil && new Date() > user.lockUntil) {
                await User.findOneAndUpdate({ email},{isFrozen: false, Count:0,lockUntil:undefined})
            } else {
                throw new Error('User a locked account');
            }
        }

        const checkPassword = await user.comparePassword(password)
        if (!checkPassword) {
            await User.findOneAndUpdate({ email }, { $inc: { Count: 1 } }, { new: true })
            //  const time =new Date(Date.now() + 12 * 60 * 60 * 1000)
                const time = new Date(Date.now()+15*1000)
            if (user.Count >= 3) {
                await User.findOneAndUpdate({ email }, { isFrozen: true,lockUntil:time}, { new: true })
                throw new Error('User a locked account')
            }
            throw new Error('Wrong password');
        }
        const newAccessToken = AccessToken(user);
        const newRefreshToken = RefreshToken(user);
        await User.findByIdAndUpdate(user._id,
            { RefreshToken: newRefreshToken, Count: 0 }, { new: true });


        // Loại bỏ thông tin nhạy cảm trước khi trả về
        const { password: _, refreshToken: __, isFrozen: ___, Role: ____, ...others } = user.toObject();

        return {
            status: 200,
            body: {
                success: true,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: others
            }
        }
    }
    static async RefreshToken_refresh(refreshToken) {
        const response = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: response._id, RefreshToken: refreshToken });
        if (!user) {
            return {
                status: 401,
                message: "Refresh token not matched or expired"
            };
        }
        const newAccessToken = AccessToken(user);
        return {
            status: 200,
            body: {
                success: true,
                accessToken: newAccessToken
            }
        }
    }
    static async logout(refreshToken) {
        const response = await User.findOneAndUpdate(
            { RefreshToken: refreshToken },
            { RefreshToken: '' },
            { new: true })
        return {
            status: 200,
            body: {
                succes: true,
                response: response ? response : "Not complete"
            }
        }
    }
    static async UpdateCurrent(id, data) {
        const user = await User.findById(id).select("-password -Role -Count -RefreshToken");
        if (!user) throw new Error("User not found ")
        if(data.password ) user.password=data.password
        user.username = data.username||user.username
        user.email = data.email||user.email
        user.profilePic = data.profilePic||null
        await user.save()
        return {
            status:200,
            message:user?"Update":"Not complete",
            data:user?user:false
        }
    }
    static async CurrentUser(data) {
        const response = await User.findById(data.id).
            select("-password -RefreshToken ");
        return {
            status: response ? 200 : 401,
            message: response ? "success" : "Not Found ",
            data: response
        }
    }
    static async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const resetToken = await token_Email.createToken(user);
        await user.save();
        const html = ` Please click the link below to reset your password of you account. 
        <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`
        const data = {
            email,
            html,
        }
        const response = await sendMail(data);
        setTimeout(async () => {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            // console.log(user.passwordResetToken, user.passwordResetExpires);
        }, 15 * 60 * 1000)
        return {
            status: response ? 200 : 401,
            success: response ? true : false,
            message: response ? "Check email of you" : "Cannot send email"
        }
    }
}

export default UserActions;