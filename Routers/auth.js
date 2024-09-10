import { Router } from "express";
import Authcontroller from '../controllers/auth.js';
import {
    verifyTokenAdmin,
    verifyAccessToken
}
    from '../Middleware/verify.js';
import validationDTO from "../Middleware/validation.js";
import {
    EmailDTO,
    PasswordDTO,
    stringReq,
    CF_Password,
    passwordReq,
} from "../utils/joi.js"
import Joi from "joi";
import uploadCloud from "../Config/cloud.js";
const router = Router();
router.post('/', validationDTO(Joi.object({
    email: EmailDTO,
    password: PasswordDTO,
    username: stringReq,
    confirm_password: CF_Password
})), Authcontroller.register);
router.get('/logout', Authcontroller.logout);

router.post('/login', validationDTO(Joi.object({
    email: EmailDTO,
    password: passwordReq,
})), Authcontroller.login);
router.put('/Update', uploadCloud.single('path'), verifyAccessToken, Authcontroller.UpdateCurrent)
router.get('/Current', verifyAccessToken, Authcontroller.CurrentUser);
export default router;
