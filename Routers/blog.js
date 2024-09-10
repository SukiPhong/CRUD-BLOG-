import Post  from "../controllers/blog.js";
import   {
    verifyTokenAdmin,
    verifyAccessToken ,
} from "../Middleware/verify.js";
import uploadCloud from "../Config/cloud.js";
import Router from "express"
const router =Router()
//var uploadP =uploadCloud.fields(  [{ name:'path',maxCount:10}]);
router.post('/create/',verifyAccessToken,verifyTokenAdmin,uploadCloud.single('path'),Post.createBlog)
router.get('/',Post.ListPost)
router.get('/list',verifyAccessToken,Post.getUserListPosts)
router.put('/reply/:pid',verifyAccessToken,Post.replyToPost)
router.get('/detail/:pid',Post.showDetailPost)
router.get('/search',Post.SearchPost)
router.post('/approve/:bid',verifyAccessToken,verifyTokenAdmin,Post.ApproveBlog)
router.get('/:id',verifyAccessToken,Post.getBlog)
router.put('/DCM/:pid',verifyAccessToken,verifyTokenAdmin,Post.deleteCMT)
router.delete('/:pid',verifyAccessToken,verifyTokenAdmin,Post.deletePost)
router.post('/:pid',verifyAccessToken,Post.likePost)
router.put('/update/:pid',verifyAccessToken,verifyTokenAdmin,uploadCloud.single('path'),Post.updatePost)

export default router;