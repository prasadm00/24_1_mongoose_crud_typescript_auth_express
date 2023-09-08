import Joi from 'joi'

//validation schema
export const UserschemaValidate = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string()
        .required()
        .messages({
            "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
            "string.empty": `Password cannot be empty`,
            "any.required": `Password is required`,
        })
    ,
    age: Joi.number().required(),
    gender: Joi.string().required(),
    role: Joi.string().required(),
    provider: Joi.string(),
    googleId: Joi.string()
})