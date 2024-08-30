import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10; // The cost factor for hashing
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

export async function verifyPassword(userSubmittedPassword: string, storedHashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(userSubmittedPassword, storedHashedPassword);
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch(error) {
        return false;
    }
}

export const generateToken = (name: string) => {
    return jwt.sign({ name }, process.env.JWT_SECRET_KEY, { expiresIn: '15 days' });
};