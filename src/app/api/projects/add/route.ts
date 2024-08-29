
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/neoDb';

export async function POST(req: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const { title, description, link, email } = await req.json();

    if (!title || !description || !link || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the user by email using Cypher query
    const userResult = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN u
      `,
      { email }
    );

    if (userResult.records.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newProject = { title, description, link };
    await session.run(
      `
      MATCH (u:User {email: $email})
      CREATE (p:Project {title: $title, description: $description, link: $link})
      MERGE (u)-[:HAS_PROJECT]->(p)
      `,
      { email, title, description, link }
    );

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}

export async function DELETE(req: NextRequest) {
  const driver = await connect(); // Connect to Neo4j AuraDB
  const session = driver.session(); // Create a session from the driver

  try {
    const { title, email } = await req.json();

    if (!title || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the user by email and project by title using Cypher query
    const projectResult = await session.run(
      `
      MATCH (u:User {email: $email})-[:HAS_PROJECT]->(p:Project {title: $title})
      RETURN p
      `,
      { email, title }
    );

    if (projectResult.records.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete the project
    await session.run(
      `
      MATCH (u:User {email: $email})-[:HAS_PROJECT]->(p:Project {title: $title})
      DELETE p
      `,
      { email, title }
    );

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting project:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await session.close(); // Ensure the session is closed
    await driver.close();  // Close the driver connection if you no longer need it
  }
}
