import { Request, Response } from 'express';
import {
    generateToken,
    hashPassword,
    validateEmail,
    validateFilled,
    verifyPassword,
    verifyToken
} from "../../utils/authenticationUtils";
import * as AuthService from '../../services/authService';
import nodemailer from 'nodemailer';


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!validateEmail(email) || !validateFilled(email) || !validateFilled(password) || password.length < 8) {
            return res.status(400).json("Incorrect fields");
        }
        const user = await AuthService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json("User not found");
        }
        const isPasswordCorrect = await verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json("Incorrect password");
        }
        const token = generateToken(user['name']);
        res.status(200).json({ token, username: user['name'] });
    } catch (error) {
        console.error(error);
        res.status(500).json("Unknown error");
    }
};


export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
        if (!validateEmail(email) || !validateFilled(email) || !validateFilled(username) || !validateFilled(password) || password.length < 8) {
            return res.status(400).json("Incorrect fields");
        }
        const user = await AuthService.getUserByEmail(email);
        if (user) {
            return res.status(400).json("Email is already being used");
        }
        const hashedPassword = await hashPassword(password);
        const registerSuccess = await AuthService.registerUser(email, username, hashedPassword);
        if (!registerSuccess) {
            return res.status(500).json("Unknown error");
        }
        const token = generateToken(username);
        return res.status(200).json(token);
    } catch (error) {
        console.error(error);
        res.status(500).json("Unknown error");
    }
};


export const verifySession = async (req: Request, res: Response) => {
    try {
        const {token} = req.body;
        const user= verifyToken(token)
        if (user) {
            res.status(200).json(user['name']);
        } else {
            res.status(401).json("Not Authorized");
        }
    } catch (error) {
        res.status(500).json("Unknown error");
    }
}

export const recoverPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!validateEmail(email) || !validateFilled(email)) {
            return res.status(400).json("Incorrect fields");
        }
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'josepinho262@gmail.com',
                pass: 'Kaxinas99!!'
            }
        });
        let info = await transporter.sendMail({
            from: 'josepinho262@gmail.com',
            to: email,
            subject: "Hello ✔",
            text: "Hello world?",
            html: "<b>Hello world?</b>"
        });
        console.log("Message sent: %s", info.messageId);
        res.status(200).json(info.messageId);
    } catch (error) {
        console.log(error);
        res.status(500).json("Unknown error");
    }
}
