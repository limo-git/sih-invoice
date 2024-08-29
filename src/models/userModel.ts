// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     link: {
//         type: String,
//         required: true,
//     },
// });

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: [true, "Please provide a username"],
//         unique: true,
//     },
//     email: {
//         type: String,
//         required: [true, "Please provide an email"],
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: [true, "Please provide a password"],
//     },
//     isVerified: {
//         type: Boolean,
//         default: false,
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false,
//     },
//     forgotPasswordToken: String,
//     forgotPasswordTokenExpiry: Date,
//     verifyToken: String,
//     verifyTokenExpiry: Date,
//     projects: [projectSchema], 
// });

// const User = mongoose.models.users || mongoose.model("users", userSchema);

// export default User;
import { connect } from '@/dbConfig/neoDb';
import bcrypt from 'bcryptjs';

export async function findUserByEmailOrUsername(emailOrUsername: string) {
    const driver = await connect();
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (user:User)
            WHERE user.email = $emailOrUsername OR user.username = $emailOrUsername
            RETURN user
            `,
            { emailOrUsername }
        );

        if (result.records.length === 0) {
            return null;
        }

        const user = result.records[0].get('user').properties;
        return user;

    } finally {
        await session.close();
    }
}
