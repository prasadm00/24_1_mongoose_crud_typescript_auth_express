
import * as mongoose from 'mongoose'

const url = `${process.env.DB_CONN_STRING}/${process.env.DB_NAME}`


export async function connectToDatabase() {
    console.log("URL", url);
    mongoose.connect(url).then((result) => {
        console.log("Connected to the DB successfully");
    }).catch((err) => {
        console.log("Error", err);
    });
}