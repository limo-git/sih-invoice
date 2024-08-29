import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/options'; // Import your NextAuth configuration

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log(session)

  if (session) {
    return NextResponse.json({ message: 'Authenticated', session });
  } else {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
}
