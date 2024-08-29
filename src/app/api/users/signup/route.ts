// import {connect} from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";


// connect()


// export async function POST(request: NextRequest){
//     try {
//         const reqBody = await request.json()
//         const {username, email, password} = reqBody

//         console.log(reqBody);

//         //check if user already exists
//         const user = await User.findOne({email})

//         if(user){
//             return NextResponse.json({error: "User already exists"}, {status: 400})
//         }

//         //hash password
//         const salt = await bcryptjs.genSalt(10)
//         const hashedPassword = await bcryptjs.hash(password, salt)

//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword
//         })

//         const savedUser = await newUser.save()
//         console.log(savedUser);

//         //send verification email

//         await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

//         return NextResponse.json({
//             message: "User created successfully",
//             success: true,
//             savedUser
//         })
        
        


//     } catch (error: any) {
//         return NextResponse.json({error: error.message}, {status: 500})

//     }
// }

import { connect } from "@/dbConfig/neoDb"; // Your Neo4j connection setup
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const driver = await connect(); // Returns a Driver instance
  const session = driver.session(); // Create a session from the driver

  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log(reqBody);

    // Check if user already exists
    const userResult = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (userResult.records.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const userId = uuidv4(); // Generate a unique ID for the user

    // Create the new user in the database
    const createUserQuery = `
      CREATE (u:User {
        id: $userId,
        username: $username,
        email: $email,
        password: $hashedPassword
      })
      RETURN u
    `;

    const newUserResult = await session.run(createUserQuery, {
      userId,
      username,
      email,
      hashedPassword,
    });

    const savedUser = newUserResult.records[0].get("u").properties;
    console.log(savedUser);

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser.id });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });

  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}
