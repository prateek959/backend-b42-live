import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';
import cors from 'cors';
import userRouter from './routes/user.route.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/user',userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT,async ()=>{
    await db();
    console.log(`Server is running on ${PORT}`);
})