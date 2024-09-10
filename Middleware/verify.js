import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
const verifyAccessToken = asyncHandler(async(req,res,next)=>{
   
    if (req?.headers?.authorization?.startsWith('Bearer')){
        const token =req.headers.authorization.split(' ')[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                res.status(401).json("Token isn't valid")
            }
            req.user =user;
           next();
        })
      
    }else{
        res.status(401).json("U're not Authenticated");
    }
})

const verifyTokenAdmin =asyncHandler(async(req,res,next)=>{
    const {Role} = req.user;

    if(Role !==true) // true:admin false: not admin
    return res.status(401).json({
        mes:"U're not Admin ",
        sucess:false
    })
    next();
})
export {
    verifyTokenAdmin,
    verifyAccessToken 
}