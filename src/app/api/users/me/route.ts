// import { getDataFromToken } from "@/helpers/getDataFromTokens";

// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/userModel";
// import { connect } from "@/dbConfig/dbConfig";

// connect();

// export async function GET(request:NextRequest){

//     try {
//         const userId = await getDataFromToken(request);
//         const user = await User.findOne({_id: userId}).select("-password");
//         return NextResponse.json({
//             mesaaage: "User found",
//             data: user
//         })
//     } catch (error:any) {
//         return NextResponse.json({error: error.message}, {status: 400});
//     }

// }

import { getDataFromToken } from "@/helpers/getDataFromTokens";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/neoDb";

connect();

export async function GET(request: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const userId = await getDataFromToken(request);

    // Cypher query to find the user by ID
    const userResult = await session.run(
      `
      MATCH (u:User {id: $userId})
      RETURN u {
        .id,
        .username,
        .email,
        .isVerified
        // Any other fields you need
      } AS user
      `,
      { userId }
    );

    if (userResult.records.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.records[0].get("user");

    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}
