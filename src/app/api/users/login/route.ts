// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// connect();

// export async function POST(request: NextRequest) {
//   try {
//     const reqBody = await request.json();
//     const { email, password } = reqBody;
//     console.log("Request body:", reqBody);

//     // Find the user by email
//     const user = await User.findOne({ email });
//     console.log("User found:", user);
//     if (!user) {
//       return NextResponse.json({ error: "User does not exist" }, { status: 400 });
//     }

//     // Check if the password is valid
//     const validPassword = await bcryptjs.compare(password, user.password);
//     console.log("Password valid:", validPassword);
//     if (!validPassword) {
//       return NextResponse.json({ error: "Invalid password" }, { status: 400 });
//     }

//     // Create a token payload
//     const tokenData = {
//       id: user._id,
//       username: user.username,
//       email: user.email,
//     };

//     // Sign the token
//     const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
//       expiresIn: "1d",
//     });
//     console.log("JWT token created:", token);

//     // Set the token in cookies
//     const response = NextResponse.json({
//       message: "Login successful",
//       success: true,
//     });
//     response.cookies.set("token", token, {
//       httpOnly: true,
//     });

//     return response;
//   } catch (error: any) {
//     console.log("Error in login route:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
import { connect } from "@/dbConfig/neoDb";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log("Request body:", reqBody);

    // Find the user by email using Cypher query
    const userResult = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN u
      `,
      { email }
    );

    if (userResult.records.length === 0) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const user = userResult.records[0].get("u").properties;
    console.log("User found:", user);

    // Check if the password is valid
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log("Password valid:", validPassword);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Create a token payload
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // Sign the token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    console.log("JWT token created:", token);

    // Set the token in cookies
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.log("Error in login route:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}
