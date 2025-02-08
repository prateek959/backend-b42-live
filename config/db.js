import mongoose from "mongoose";

const db = async ()=>{
try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/travel');
    console.log('DB Connected Successfully');
} catch (error) {
    console.log(error.message);
    res.status(500).json({msg:"Internal Server Error"});
}
}

export default db;