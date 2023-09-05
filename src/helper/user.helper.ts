import { UserModel } from '../models/users/users.model'
export class userService {
    //create a user
    async createUser(data: any) {
        try {
            const newUser = await UserModel.create(data)
            return newUser

        } catch (error) {
            console.log(error)
        }
    }

    //get all users
    async getUsers() {
        try {
            const users = await UserModel.find({})
            return users

        } catch (error) {
            console.log(error)
        }
    }

    //get a single user
    async getUser(id: string) {
        try {
            const user = await UserModel.findById({ _id: id })
            if (!user) {
                return 'user not available'
            }
            return user

        } catch (error) {
            console.log(error)
        }
    }

    //update a user
    async updateUser(id: string, data: any) {
        try {
            //pass the id of the object you want to update
            //data is for the new body you are updating the old one with
            //new:true, so the dats being returned, is the update one
            const userz = await UserModel.findByIdAndUpdate({ _id: id }, data, { new: true })
            if (!userz) {
                return "user not available"
            }
            return userz
        } catch (error) {
            console.log(error)
        }
    }

    //delete a user by using the find by id and delete 
    async deleteUser(id: string) {
        try {
            const user = await UserModel.findByIdAndDelete(id)
            if (!user) {
                return 'user not available'
            }
        } catch (error) {
            console.log(error)
        }
    }
    async getUserByEmail(email: string) {
        console.log("Inside getUserByEmail ");
        try {

            let user = await UserModel.findOne({ email: email })
            return user;
        } catch (error) {
            console.log(error);
        }
    }
}

//export the class
export const userServices = new userService()