import  jwt  from "jsonwebtoken";
const AccessToken =(user)=>{
    return jwt.sign({
        id:user.id,
        Role:user.Role,
        email:user.email,
        username:user.username,
        // userProfilePic:user.profilePic
    },process.env.JWT_SECRET,{
        expiresIn:"1d"
    })
}
const RefreshToken =(user)=>{
    return jwt.sign({
        id:user.id,
    },process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}
export {
    AccessToken,
    RefreshToken
}