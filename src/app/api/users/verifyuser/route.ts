// import {connect} from "@/dbConfig/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/userModel";



// connect()


// export async function POST(request: NextRequest){

//     try {
//         const reqBody = await request.json()
//         const {token} = reqBody
//         console.log(token);

//         const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

//         if (!user) {
//             return NextResponse.json({error: "Invalid token"}, {status: 400})
//         }
//         console.log(user);

//         user.isVerfied = true;
//         user.verifyToken = undefined;
//         user.verifyTokenExpiry = undefined;
//         await user.save();
        
//         return NextResponse.json({
//             message: "Email verified successfully",
//             success: true
//         })


//     } catch (error:any) {
//         return NextResponse.json({error: error.message}, {status: 500})
//     }

// }

import { connect } from "@/dbConfig/neoDb"; // Your Neo4j connection setup
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log(token);

    // Query to find the user with the given token and verifyTokenExpiry greater than current date
    const userResult = await session.run(
      `
      MATCH (u:User {verifyToken: $token})
      WHERE u.verifyTokenExpiry > $currentTime
      RETURN u
      `,
      { token, currentTime: Date.now() }
    );

    if (userResult.records.length === 0) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const user = userResult.records[0].get("u").properties;
    console.log(user);

    // Update user node to set isVerified to true and remove verifyToken and verifyTokenExpiry
    await session.run(
      `
      MATCH (u:User {verifyToken: $token})
      SET u.isVerified = true, u.verifyToken = null, u.verifyTokenExpiry = null
      RETURN u
      `,
      { token }
    );

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });

  } catch (error: any) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });

  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}
