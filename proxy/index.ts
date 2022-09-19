import OS from "os";
import FS from "fs";
import Dot from "dotenv";
import Path from "path";
import Utility from "util";
import Subprocess from "child_process";

Dot.config( {
    path: Path.join( __dirname, ".env" )
} );

export const Setup = async () => {
    const { spawn } = Subprocess;

    const proxy = [ process.env[ "LOCAL_PORT" ], process.env[ "DATABASE_HOSTNAME" ], process.env[ "DATABASE_PORT" ] ].join( ":" );
    const bastion = [ process.env[ "BASTION_USERNAME" ], process.env[ "BASTION_HOSTNAME" ] ].join( "@" );

    /*** Strictly-Typed SSH Tunnel + Reverse Port-Forward Proxy Command */
    const parameters: Readonly<[ "-L", string, string, "-i", string, "-N" ]> = [ "-L", proxy, bastion, "-i", process.env[ "BASTION_KEY" ]!, "-N" ];

    console.debug( "[Debug] [SSH-Command]", [ "ssh", ...parameters ] );

    const subprocess = spawn( "ssh", parameters, {
        // shell: false, stdio: "inherit", detached: true
        shell: true, stdio: "inherit", detached: false
    } );

    /***
     * By default, the parent will wait for the detached child to exit. To
     * prevent the parent from waiting for a given subprocess to exit, use
     * the subprocess.unref() method. Doing so will cause the parent's event
     * loop to not include the child in its reference count, allowing the
     * parent to exit independently of the child, unless there is an established
     * IPC channel between the child and the parent.
     */

    /*** *.unref() for Detachment (Useful for Tunnel-Required Runtimes */
    // subprocess.unref();

    process.on( "exit", () => {
        subprocess.kill( "SIGTERM" );
    } );

    return await new Promise<Subprocess.ChildProcess>( ( resolve ) => {
        /*** Event Listener - Safe Mutex-Unlock Upon Successful SSH Tunnel */
        subprocess.on( "spawn", async () => {
            resolve( subprocess );
        } );
    } );
};

export module Database {
    export const collections = async ( connection: import("mongodb").MongoClient ) => {
        const database = connection.db();

        const collections = await database.collections();

        return collections.map( ( collection ) => collection.collectionName );
    };

    export const Selection = async ( connection: import("mongodb").MongoClient, collection: string ) => {
        const db = ( process.env[ "DATABASE_CURSOR" ] ) ? connection.db( process.env[ "DATABASE_CURSOR" ] )
            : connection.db();

        const selection = db.collection( collection );

        const data: Database.Collectable[] = [];

        /*** Cursor Reference (Pointer) */
        const stream = selection.find().stream();

        /*** Cursor Reference (Pointer) */
        const statistics = selection.stats();

        const { collectionName: name } = selection;
        const { dbName: database } = selection;
        const { namespace } = selection;

        data.push( { name, database, namespace, statistics, stream } );

        const global = Object.create( {
            storage: 0, size: 0, documents: 0
        } );

        const cursor: Database.Export["collections"] = Object.create( {} );

        for ( const [ index, enumeration ] of Object.entries( data ) ) {
            /*** Dereference */
            const statistics = await enumeration.statistics;

            global[ "storage" ] += statistics.storageSize;
            global[ "size" ] += statistics.size;
            global[ "documents" ] += statistics.count;

            if ( cursor[ enumeration.name ] ) {
                throw new Error( "Fatal Error - Cross-Collection Name Clash" );
            }

            cursor[ enumeration.name ] = {
                ...enumeration, ...{
                    worker: parseInt( index ),
                    /*** Pointer Pass-Through */
                    stream: enumeration.stream, // enumeration.stream.on("data", (chunk: Object) => console.log(chunk)),
                    statistics: {
                        valid: ( statistics.ok === 1 ),
                        size: ( statistics.size / 1.024e6 ).toFixed( 3 ) + "MB",
                        storage: ( statistics.storageSize / 1.024e6 ).toFixed( 3 ) + "MB",
                        documents: statistics.count
                    }
                }
            };
        }

        global[ "storage" ] = ( global[ "storage" ] / 1.024e6 ).toFixed( 3 ) + "MB";
        global[ "size" ] = ( global[ "size" ] / 1.024e6 ).toFixed( 3 ) + "MB";

        return { statistics: global, collections: cursor } as Database.Export;
    };

    export const Streamable = async ( connection: import("mongodb").MongoClient ) => {
        const database = connection.db();

        const collections = await database.collections();

        const data: Database.Collectable[] = [];

        collections.forEach( ( collection ) => {
            /*** Cursor Reference (Pointer) */
            const stream = collection.find().stream();

            /*** Cursor Reference (Pointer) */
            const statistics = collection.stats();

            const { collectionName: name } = collection;
            const { dbName: database } = collection;
            const { namespace } = collection;

            data.push( { name, database, namespace, statistics, stream } );
        } );

        const global = Object.create( {
            storage: 0, size: 0, documents: 0
        } );

        const cursor: Database.Export["collections"] = Object.create( {} );

        for ( const [ index, enumeration ] of Object.entries( data ) ) {
            /*** Dereference */
            const statistics = await enumeration.statistics;

            global[ "storage" ] += statistics.storageSize;
            global[ "size" ] += statistics.size;
            global[ "documents" ] += statistics.count;

            cursor[ enumeration.name ] = {
                ...enumeration, ...{
                    worker: parseInt( index ),
                    /*** Pointer Pass-Through */
                    stream: enumeration.stream, // enumeration.stream.on("data", (chunk: Object) => console.log(chunk)),
                    statistics: {
                        valid: ( statistics.ok === 1 ),
                        size: ( statistics.size / 1.024e6 ).toFixed( 3 ) + "MB",
                        storage: ( statistics.storageSize / 1.024e6 ).toFixed( 3 ) + "MB",
                        documents: statistics.count
                    }
                }
            };
        }

        global[ "storage" ] = ( global[ "storage" ] / 1.024e6 ).toFixed( 3 ) + "MB";
        global[ "size" ] = ( global[ "size" ] / 1.024e6 ).toFixed( 3 ) + "MB";

        return { statistics: global, collections: cursor } as Database.Export;
    };

    export type Global = { storage: 0 | number | string, size: 0 | number | string, documents: number };
    export type Statistic = { valid: boolean; size: string; storage: string; documents: number };
    export type Stream = NodeJS.ReadableStream & AsyncIterable<import("mongodb").WithId<import("bson").Document>>;
    export type Translation = { stream: Database.Stream, name: string, database: string, namespace: string, statistics: Database.Statistic };
    export type Export = { statistics: Global, collections: { [ $: Database.Collectable["name"] ]: Database.Translation } };
    export type Collectable = { stream: NodeJS.ReadableStream & AsyncIterable<import("mongodb").WithId<import("bson").Document>>, name: string, database: string, namespace: string, statistics: Promise<import("mongodb").CollStats> };
}


const Command = async () => {
    await Setup();

    const { MongoClient: Client } = await import("mongodb");

    const client = new Client( "mongodb://127.0.0.1:27017/content", {
        auth: {
            username: "devadmin",
            password: "!28ER3PXH&"
        }, tls: true,
        tlsCAFile: Path.join( OS.userInfo( { encoding: "utf-8" } ).homedir, ".tls", "rds-combined-ca-bundle.pem" ),
        replicaSet: "rs0",
        monitorCommands: true,
        tlsAllowInvalidHostnames: true,
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 5000,
        directConnection: true,
    } );

    await client.connect();

    console.time("Start-Find");

    const collection = client.db("content").collection("book");

    if (!(collection)) throw new ReferenceError();

    const cursor = collection.find(/*** search */);

    const array = await cursor.toArray();

    console.timeEnd("Start-Find");

    FS.writeFileSync( "Find-Results.json", JSON.stringify( { "data": array }, null, 4 ), { encoding: "utf-8" } );
    await client.close();
}

Setup().catch((exception) => console.trace(exception))

export {}
