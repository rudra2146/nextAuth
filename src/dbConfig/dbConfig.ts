import mongoose from "mongoose";


export async function connectDB(){
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected',()=>{
            console.log('MongoDB connected')
        })
        connection.on('error',(err)=>{
            console.log('Mongodb connection error, please make sure db is up and running '+err)
            process.exit();
        })
    } catch (error) {
        console.log("Something went wrong in connecting  DB")
        console.log(error)
    }
}