import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/neoDb';

export async function GET(req: NextRequest) {
  const driver = await connect();
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[:HAS_PROJECT]->(p:Project)
      RETURN p, u.username AS creator
      `
    );

    const projects = result.records.map(record => ({
      ...record.get('p').properties,
      username: record.get('creator')
    }));

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching projects:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await session.close();
    await driver.close();
  }
}
