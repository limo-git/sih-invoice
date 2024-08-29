import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/neoDb'; // Import the connect function

export async function POST(req: NextRequest) {
    const { followerEmail, followingEmail } = await req.json();
    
    if (!followerEmail || !followingEmail) {
        return new NextResponse(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const driver = await connect(); // Connect to Neo4j AuraDB
    const session = driver.session(); // Create a session from the driver

    try {
        // Retrieve the usernames from email addresses
        const result = await session.run(
            `MATCH (follower:User {email: $followerEmail}), (following:User {email: $followingEmail})
            MERGE (follower)-[:FOLLOWS]->(following)
            RETURN follower, following`,
            { followerEmail, followingEmail }
        );

        if (result.records.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: 'Users not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: `Successfully followed user: ${followingEmail}` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        console.error('Error following user:', error.message, error.stack);
        return new NextResponse(
            JSON.stringify({ error: 'Server error', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await session.close();
        await driver.close(); // Close the driver
    }
}


export async function DELETE(req: NextRequest) {
    const { followerEmail, followingEmail } = await req.json();

    if (!followerEmail || !followingEmail) {
        return new NextResponse(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const driver = await connect(); // Connect to Neo4j AuraDB
    const session = driver.session(); // Create a session from the driver

    try {
        // Retrieve follower and following users by their email addresses
        const followerResult = await session.run(
            `MATCH (follower:User {email: $followerEmail}) RETURN follower.username AS username`,
            { followerEmail }
        );
        const followingResult = await session.run(
            `MATCH (following:User {email: $followingEmail}) RETURN following.username AS username`,
            { followingEmail }
        );

        const followerUsername = followerResult.records[0]?.get('username');
        const followingUsername = followingResult.records[0]?.get('username');
        console.log(followerUsername)
        console.log(followingUsername)
        if (!followerUsername || !followingUsername) {
            return new NextResponse(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Use usernames to delete the follow relationship
        const result = await session.run(
            `MATCH (follower:User {username: $followerUsername})-[r:FOLLOWS]->(following:User {username: $followingUsername})
            DELETE r
            RETURN follower, following`,
            { followerUsername, followingUsername }
        );

        if (result.records.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: 'Relationship or users not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: `Successfully unfollowed user: ${followingUsername}` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        console.error('Error unfollowing user:', error.message);
        return new NextResponse(
            JSON.stringify({ error: 'Server error', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await session.close();
        await driver.close(); // Close the driver
    }
}



// import { NextRequest, NextResponse } from 'next/server';
// import instance from '@/models/user';

// export async function GET(req:NextRequest){
//     const hello = console.log("hello")
//     return new NextResponse(
//         JSON.stringify({ message: "hello" }),
//         { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
// }

// export async function POST(req: NextRequest) {
//     const { followerEmail, followingEmail } = await req.json();

//     if (!followerEmail || !followingEmail) {
//         return new NextResponse(
//             JSON.stringify({ error: 'Missing required fields' }),
//             { status: 400, headers: { 'Content-Type': 'application/json' } }
//         );
//     }

// //     const session = instance.session();

// //     try {
// //         // Retrieve follower and following users by their email addresses
// //         const followerUser = await instance.first('User', 'email', followerEmail);
// //         const followingUser = await instance.first('User', 'email', followingEmail);
// //         console.log(followerUser)
// //         console.log(followingUser)
// //         if (!followerUser || !followingUser) {
// //             return new NextResponse(
// //                 JSON.stringify({ error: 'User not found' }),
// //                 { status: 404, headers: { 'Content-Type': 'application/json' } }
// //             );
// //         }

// //         // Extract usernames
// //         const followerUsername = followerUser.get('username');
// //         const followingUsername = followingUser.get('username');

//         // Use usernames to send the follow request
//         await followerEmail.relateTo(followingEmail, 'following');

//         return new NextResponse(
//             JSON.stringify({ message: `Successfully followed user: ` }),
//             { status: 200, headers: { 'Content-Type': 'application/json' } }
//         );
//     // } catch (error: any) {
//     //     console.error('Error following user:', error.message);
//     //     return new NextResponse(
//     //         JSON.stringify({ error: 'Server error' }),
//     //         { status: 500, headers: { 'Content-Type': 'application/json' } }
//     //     );
//     // } finally {
//     //     await session.close();
//     // }
// }

// export async function DELETE(req: NextRequest) {
//     const { followerEmail, followingEmail } = await req.json();

//     if (!followerEmail || !followingEmail) {
//         return new NextResponse(
//             JSON.stringify({ error: 'Missing required fields' }),
//             { status: 400, headers: { 'Content-Type': 'application/json' } }
//         );
//     }

//     const session = instance.session();

//     try {
//         // Retrieve follower and following users by their email addresses
//         const followerUser = await instance.first('User', 'email', followerEmail);
//         const followingUser = await instance.first('User', 'email', followingEmail);

//         if (!followerUser || !followingUser) {
//             return new NextResponse(
//                 JSON.stringify({ error: 'User not found' }),
//                 { status: 404, headers: { 'Content-Type': 'application/json' } }
//             );
//         }

//         // Extract usernames
//         const followerUsername = followerUser.get('username');
//         const followingUsername = followingUser.get('username');

//         // Use usernames to send the unfollow request
//         await followerUser.detachFrom(followingUser);

//         return new NextResponse(
//             JSON.stringify({ message: `Successfully unfollowed user: ${followingUsername}` }),
//             { status: 200, headers: { 'Content-Type': 'application/json' } }
//         );
//     } catch (error: any) {
//         console.error('Error unfollowing user:', error.message);
//         return new NextResponse(
//             JSON.stringify({ error: 'Server error' }),
//             { status: 500, headers: { 'Content-Type': 'application/json' } }
//         );
//     } finally {
//         await session.close();
//     }
// }
