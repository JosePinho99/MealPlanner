import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10; // The cost factor for hashing
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

// async function registerUser(username: string, password: string): Promise<void> {
//     const hashedPassword = await hashPassword(password);
//     const newUser: User = { username, password: hashedPassword };
//     // Assume saveUser is a function that saves the user's data to the database.
//     await saveUser(newUser);
// }

export async function verifyPassword(userSubmittedPassword: string, storedHashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(userSubmittedPassword, storedHashedPassword);
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
}