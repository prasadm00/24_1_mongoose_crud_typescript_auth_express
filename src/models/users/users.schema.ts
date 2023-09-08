
import * as Mongoose from "mongoose";

const UserSchema = new Mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    age: Number,
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
    gender: String,
    role: String,
    provider: String,
    googleId: String

});

export default UserSchema;


