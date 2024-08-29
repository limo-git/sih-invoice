// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import User from '@/models/userModel'; 
// import { connect } from '@/dbConfig/dbConfig';

// export async function GET(req: Request) {
//   const email = req.headers.get('user-email');

//   if (!email) {
//     return NextResponse.json({ message: 'Missing user email' }, { status: 400 });
//   }

//   try {
//     await connect();

//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json(user.projects);
//   } catch (error) {
//     console.error('Error fetching projects:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

// import { NextResponse } from 'next/server';
// import { connect } from '@/dbConfig/neoDb';

// export async function GET(req: Request) {
//   const email = req.headers.get('user-email');

//   if (!email) {
//     return NextResponse.json({ message: 'Missing user email' }, { status: 400 });
//   }

//   const driver = await connect(); // Connect to Neo4j AuraDB
//   const session = driver.session(); // Create a session from the driver

//   try {
//     // Cypher query to find the user and retrieve projects
//     const userResult = await session.run(
//       `
//       MATCH (u:User {email: $email})-[:HAS_PROJECT]->(p:Project)
//       RETURN p { .title, .description, .link } AS project
//       `,
//       { email }
//     );

//     if (userResult.records.length === 0) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     const projects = userResult.records.map((record) => record.get('project'));

//     return NextResponse.json(projects);
//   } catch (error: any) {
//     console.error('Error fetching projects:', error.message);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   } finally {
//     await session.close(); // Ensure the session is closed
//     await driver.close();  // Close the driver connection if you no longer need it
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/neoDb';

export async function GET(req: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    // Find the user by email and get their projects
    const result = await session.run(
      `
      MATCH (u:User {email: $email})-[:HAS_PROJECT]->(p:Project)
      RETURN p
      `,
      { email }
    );

    const projects = result.records.map(record => record.get('p').properties);

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching projects:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}
