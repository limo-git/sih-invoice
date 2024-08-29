// import { NextResponse } from "next/server";


// export async function GET() {
//     try {
//         const response = NextResponse.json(
//             {
//                 message: "Logout successful",
//                 success: true,
//             }
//         )
//         response.cookies.set("token", "", 
//         { httpOnly: true, expires: new Date(0) 
//         });
//         return response;
//     } catch (error: any) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
        
//     }

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Clear the token by setting an expired cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error("Error during logout:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
