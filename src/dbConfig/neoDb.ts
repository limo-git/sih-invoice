import neo4j from 'neo4j-driver';

export async function connect() {
    try {
        const uri = process.env.NEO4J_URI!;
        const user = process.env.NEO4J_USER!;
        const password = process.env.NEO4J_PASSWORD!;

        
        const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

        
        const session = driver.session();
        await session.run('RETURN 1');
        
        console.log('Neo4j connected successfully');

        session.close(); 


        return driver;

    } catch (error) {
        console.log('Something went wrong while connecting to Neo4j!');
        console.log(error);
        process.exit();
    }
}
