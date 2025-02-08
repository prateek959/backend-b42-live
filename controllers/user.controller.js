import argon2 from "argon2";
import User from "../models/user.schema.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const data = await User.findOne({ email: email });

        if (data) {
            return res.status(400).json({ msg: "User already exist" });
        }

        const hashPass = await argon2.hash(password);

        await User.create({
            username,
            email,
            password: hashPass
        });

        res.status(201).json({ msg: "User register Successfully" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const data = await User.findOne({ email: email });

        if (!data) {
            return res.status(400).json({ msg: "Email is invalid" });
        }

        const passwordMatch = await argon2.verify(data.password, password);
        if (!passwordMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }


        const token = jwt.sign({
            email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token: token });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const data = await User.findOne({ email: email });

        if (!data) {
            res.status(400).json({ msg: "Email is Invalid" });
            return;
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5min' });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
            secure: true,
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password",
            html: `<h3>Click the button below to reset your password:</h3>
            <a href="http://localhost:3001/reset-password?token=${token}">Reset Password</a>`
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: "Mail Sent Successfully" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


const resetPassword = async (req, res) => {
    try {
       const {token} = req.query;

       if(!token){
        return res.status(400).json({msg:"Token is required"});
       }

       const decoded = jwt.verify(token,process.env.JWT_SECRET);

       if(!decoded){
        return res.status(400).json({msg:"Invalid or expired token"});
       };

       const {email} = decoded;

       const data = await User.findOne({email:email});

       if(!data){
        return res.status(400).json({msg:"User is not found"});
       }

       const {newPassword} = req.body;

       if(!newPassword){
        return res.status(400).json({msg:"New Password is required"});
       }

       const hashedPassword = await argon2.hash(newPassword);

       data.password = hashedPassword

       await data.save();

       res.status(200).json({msg:"Password reset successfully"});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}








export { register, login, forgotPassword, resetPassword };