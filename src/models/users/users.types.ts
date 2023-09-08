import { Document, Model } from "mongoose";
export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age: number;
    lastUpdated?: Date;
    gender: String;
    role: String;
    provider: String;
    googelId?: String
}

export interface IUserDocument extends IUser, Document { }
export interface IUserModel extends Model<IUserDocument> { }
