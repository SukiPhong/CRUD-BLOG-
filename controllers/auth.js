'use strict';
import authService from '../Services/auth.js';
import asyncHandler from 'express-async-handler'

const Authcontroller = {
    register: asyncHandler(async (req, res) => {
        const { email, password, username, confirm_password } = req.body;
        if (!email || !username || !password || !confirm_password)
            throw new Error("Please fill all fields'")
        const response = await authService.register(email, username, password, confirm_password);
        res.status(response.status).json({
            success: response.success,
            message: response.body
        })
    }),

    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password)
            throw new Error("Please fill all fields")
        const response = await authService.login(email, password);
        if (response.status === 200) {
            res.cookie('refreshToken', response.body.refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: false,
                path: "/",
                sameSite: "strict",
            })
            return res.status(200).json({
                success: true,
                message: response.body.user,
                accessToken: response.body.accessToken
            })
        }
        else {
            return res.status(response.status).json(
                { message: response })
        }
    }),
    refreshToken_Refresh: asyncHandler(async (req, res) => {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken)
            throw new Error("No refresh  token is cookies")
        const response = await authService.RefreshToken_refresh(cookie.refreshToken);
        return res.status(response.status).json(
            {
                success: true,
                message: response.body.user,
                accessToken: response.body.accessToken
            }
        )
    }),
    logout: asyncHandler(async (req, res) => {
        const cookie = req.cookies
        if (!cookie || !cookie.refreshToken)
            throw new Error("No  refresh Token in cookies")
        const rs = await authService.logout(cookie.refreshToken);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
        })
        return res.status(200).json({
            success: true,
            mes: rs ? "Logged out successfully" : "Error"
        })
    }),
    CurrentUser: asyncHandler(async (req, res) => {
        if (!req?.user)
            throw new Error("User ID is not defined in the request")
        const response = await authService.CurrentUser(req?.user)
        return res.status(response.status).json({
            message: response.message,
            data: response.data
          })
    }),
    UpdateCurrent: asyncHandler(async (req, res) => {
        const { id } = req.user
        const { username, email, password, profilePic } = req.body
        if (!username && !email && !password) throw new Error("Missing input")
        const data = { username, email, password, profilePic }
        if (req.file) { data.profilePic = req?.file?.path }
        if (!id)
            throw new Error("User ID is not defined in the request")
        const response = await authService.UpdateCurrent(id, data)
        return res.status(response.status).json({
            message: response.message,
            data: response.data
          })
    }),
    forgotPassword: asyncHandler(async (req, res) => {
        const { email } = req.query;
        //console.log(email);
        if (!email) throw new Error("Please enter a valid email");
        const response = await authService.forgotPassword(email)

    })
}


export default Authcontroller;
