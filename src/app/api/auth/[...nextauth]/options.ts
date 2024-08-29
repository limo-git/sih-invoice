// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { NextAuthOptions } from 'next-auth';
// import bcrypt from 'bcryptjs';
// import { connect } from '@/dbConfig/dbConfig';
// import User from '@/models/user';


// export const authOptions: NextAuthOptions = {
//   providers: [

//     CredentialsProvider({
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials: any): Promise<any> {
//         console.log("Authorize function called with credentials:", credentials);
//         await connect();
//         try {
//           const user = await User.findOne({
//             $or: [
//               { email: credentials.email },
//               { username: credentials.email }
              
              
//             ]
//           }).select('password _id email username projects');
//           console.log("User found:", user);
//           if (!user) {
//             throw new Error("No user found");
//           }
//           const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
//           if (isPasswordCorrect) {
//             const userObject = user.toObject();
//             delete userObject.password;
//             return userObject;
//           } else {
//             throw new Error("Incorrect password");
//           }
//         } catch (err: any) {
//           console.log("Error in authorize function:", err.message);
//           throw new Error(err.message);
//         }
//       }
//     })
//   ],
  
//   session: {
//     strategy: 'jwt'
//   },
//   secret: process.env.NEXTAUTH_SECRET
// };

// export default NextAuth(authOptions);

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth';
import { findUserByEmailOrUsername } from '@/models/userModel'; // Adjust the import to match your file structure

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        username:{label:'username', type:'text'},
        password: { label: 'Password', type: 'password' },

      },
      async authorize(credentials: any): Promise<any> {
        console.log("Authorize function called with credentials:", credentials);
        
        try {
          const user = await findUserByEmailOrUsername(credentials.email);
          console.log("User found:", user);
          
          if (!user) {
            throw new Error("No user found");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            delete user.password;
            return {
              id: user._id, // Or another unique identifier you use
              email: user.email,
              username: user.username,
              projects: user.projects || []
            };
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          console.log("Error in authorize function:", err.message);
          throw new Error(err.message);
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);

