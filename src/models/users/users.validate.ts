import Joi from 'joi'

//validation schema
export const UserschemaValidate = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string()
        //.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required()
        .messages({
            "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
            "string.empty": `Password cannot be empty`,
            "any.required": `Password is required`,
        })
    ,
    age: Joi.number().required(),
    gender: Joi.string().required(),
})