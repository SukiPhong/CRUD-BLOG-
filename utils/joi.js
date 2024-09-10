import Joi from 'joi';

const string = Joi.string().allow(null, '');
const stringReq = Joi.string().required();
const numberReq = Joi.number().required();
const number = Joi.string().allow(null, '');
const EmailDTO = Joi.string().email().allow(null, '');
const PasswordDTO =
Joi.string().min(6).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$')).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'Password is required'
  });
const CF_Password = Joi.ref('password')
const passwordReq = Joi.string().min(6)
export {
    string,
    stringReq,
    numberReq,
    number,
    EmailDTO,
    PasswordDTO,
    CF_Password,
    passwordReq
}