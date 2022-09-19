import "dotenv/config";

import OS from "node:os";
import FS from "node:fs";
import Path from "node:path";
import Util from "node:util";
import cluster from "node:cluster";
import process from "node:process";

import * as BSON from "bson";
import type { TLS } from "@iac-factory/api-schema";

const Blob = FS.readFileSync( "./tls-ca-certificates.json", { encoding: "utf-8" } );
const Certificates: TLS.CA = { ... JSON.parse( Blob ) };

for ( const [ certificate, offset ] of Object.entries( Certificates ) ) {
    const filename = [ certificate, "pem" ].join( "." );
    const target = Path.join( __dirname, filename );
    const buffer = Buffer.from( ( offset as string ), "base64" );

    const content = buffer.toString( "ascii" );

    FS.writeFileSync( target, content );
}

FS.writeFileSync( Path.join( __dirname, "us-east-2-bundle.pem" ), Certificates[ "us-east-2-bundle" ] );

( process.env[ "INIT_CWD" ] ) && process.chdir( process.env[ "INIT_CWD" ] );

export enum Compression {
    "$0" = 0,
    "$1" = 1,
    "$2" = 2,
    "$3" = 3,
    "$4" = 4,
    "$5" = 5,
    "$6" = 6,
    "$7" = 7,
    "$8" = 8,
    "$9" = 9
}

type Variable<Generic> = { [ $: string ]: Generic };
type Assignment = ( [ string, string ] );

// export module TLS {
//     const Blob = Certificates;
//
//     export const Setup = () => {
//         for (const [certificate, offset] of Object.entries(Blob)) {
//             const filename = [certificate, "pem"].join(".");
//             const target = Path.join(process.cwd(), filename);
//             const buffer = Buffer.from((offset as string), "base64");
//
//             const content = buffer.toString("ascii");
//
//             FS.writeFileSync(target, content);
//         }
//     };
//
//     export const Clean = () => {
//         for (const [certificate, offset] of Object.entries(Blob)) {
//             const filename = [certificate, "pem"].join(".");
//             const target = Path.join(process.cwd(), filename);
//
//             FS.rmSync(target, {force: true});
//         }
//     };
// }

export module Settings {
    const Debug = [ ... Object.entries( process.env ) ];

    const Container = Object.create( {} );

    for ( const [ key, value ] of Debug ) Container[ key ] = ( value );

    /*** @type {any} */
    process.env = { ... process.env, ... Container } as const;

    /*** @type {Configuration} */
    export const Configuration: Settings.Configuration = Container as Variable<Assignment>;

    export const Default = Configuration;

    export type Keys = readonly [ keyof Settings.Configuration ];

    /***
     * - `EXTENDED` (0) - Complete Configuration
     * - `BASE` (1) - Simple `{ USERNAME, PASSWORD, PORT, URI }` configuration
     * - `SSM` (2) - SSM Parameter Store Configuration
     * - `SM` (3) - Secrets Manager Configuration
     *
     * - `default` (1) - Simple `{ USERNAME, PASSWORD, PORT, URI }` configuration
     */
    export enum Type {
        EXTENDED, BASE, SSM, SM, default = 1
    }

    export type Schema = { readonly username: string | undefined, readonly password: string | undefined, readonly port: string | undefined, readonly uri: string | undefined, readonly ssm: { readonly username: string | undefined, readonly password: string | undefined, readonly port: string | undefined, readonly uri: string | undefined }, readonly sm: string | undefined };

    export type Configuration = Readonly<{
        USERNAME?: string,
        PASSWORD?: string,
        URI?: string,
        PORT?: string,
        SSM_USERNAME?: string,
        SSM_PASSWORD?: string,
        SSM_URI?: string,
        SSM_PORT?: string,
        SECRETS_MANAGER_NAME?: string
    }>;

    /*** Create an easier to use data structure from `process.env` key-value shape */
    export function hydrate( type: Type = Type.default ) {
        /*** Extended */

        /*** @type {{password: null, port: number, uri: string, username: null}} - Type-Safe Defaults */
        const defaults = { username: null, password: null, port: 27017, uri: "localhost" };

        switch ( type ) {
            case 0: {
                return {
                    ... defaults,
                    username: Configuration[ "USERNAME" ],
                    password: Configuration[ "PASSWORD" ],
                    port:     Configuration[ "PORT" ],
                    uri:      Configuration[ "URI" ],
                    ssm:      {
                        ... defaults,
                        username: Configuration[ "SSM_USERNAME" ],
                        password: Configuration[ "SSM_PASSWORD" ],
                        port:     Configuration[ "SSM_PORT" ],
                        uri:      Configuration[ "SSM_URI" ]
                    },
                    sm:       Configuration[ "SECRETS_MANAGER_NAME" ]
                } as const;
            }
            case 1: {
                return {
                    ... defaults,
                    username: Configuration[ "USERNAME" ],
                    password: Configuration[ "PASSWORD" ],
                    port:     Configuration[ "PORT" ],
                    uri:      Configuration[ "URI" ]
                } as const;
            }
            case 2: {
                return {
                    ... defaults,
                    username: Configuration[ "SSM_USERNAME" ],
                    password: Configuration[ "SSM_PASSWORD" ],
                    port:     Configuration[ "SSM_PORT" ],
                    uri:      Configuration[ "SSM_URI" ]
                } as const;
            }
            case 3: {
                return Configuration[ "SECRETS_MANAGER_NAME" ];
            }
            default: {
                /***
                 * From a typescript perspective, without the `default` case,
                 * the application is still type-safe; however, from a runtime
                 * perspective, never is javascript type-safe.
                 */

                throw new Error( "Uncaught Node.JS TS Transpilation Error - Evaluating" + " " + "(" + type + ")" );
            }
        }
    }

    export function keys(): Readonly<Keys[] | string[]> {
        return Object.keys( Configuration );
    }
}

export module Validation {
    /*** Environment Validation of Secrets-Manager `.env` Settings */
    /*** Environment Validation of SSM `.env` Settings */

    const expression = {
        /***
         * Unified Resource Identifier
         * ---
         *
         * RegEx for Parsing Mongo-Protocol-Capable URI(s)
         */
        uri: new RegExp( "^(mongodb:(?:\\/{2})?)((\\w+?):(\\w+?)@|:?@?)(\\S+?):(\\d+)(\\/(\\S+?))?(\\?replicaSet=(\\S+?))?$", "gm" )
    };

    export function URI( hostname: string ): { error: Error | null, valid: boolean } {
        return expression.uri.test( ( hostname ) ? hostname : "" )
            && { error: null, valid: true }
            || ( () => {
                const error = Error( "Failure Validating the Database URI" + " " + "Reading" + " " + "(" + hostname + ")" );
                error.name = "Invalid-Username-Configuration";
                return { valid: false, error } as const;
            } )();
    }

    /*** Environment Validation of Baseline `.env` Settings */
    export function Default( defaults?: Defaults ) {
        const uri = process.env[ "URI" ] ?? defaults?.uri ?? null;
        const port = process.env[ "PORT" ] ?? defaults?.port ?? null;
        const username = process.env[ "USERNAME" ] ?? defaults?.username ?? null;
        const password = process.env[ "PASSWORD" ] ?? defaults?.password ?? null;

        switch ( true ) {
            case ( !( username ) ): {
                const error = Error( "Empty Username Configuration (Reading \"USERNAME\")" );
                error.name = "Invalid-Username-Configuration";
                return { valid: false, error };
            }
            case ( !( password ) ): {
                const error = Error( "Empty Username Configuration (Reading \"PASSWORD\")" );
                error.name = "Invalid-Password-Configuration";
                return { valid: false, error };
            }
            case ( !( uri ) ): {
                const error = Error( "Empty Username Configuration (Reading \"URI\")" );
                error.name = "Invalid-URI-Configuration";
                return { valid: false, error };
            }
            case ( !( port ) ): {
                const error = Error( "Empty Username Configuration (Reading \"PORT\")" );
                error.name = "Invalid-URI-Configuration";
                return { valid: false, error };
            }

            default: {
                return {
                    valid: true, error: null, settings: {
                        username, password, uri, port
                    } as const
                };
            }
        }
    }

    type Defaults = {
                        uri?: string | null | undefined,
                        port?: string | null | undefined,
                        username?: string | null | undefined,
                        password?: string | null | undefined
                    } | undefined;
}

export module Connection {
    const Home = OS.homedir();

    export function validate() {
        Validation.Default();
    }

    export function settings() {
        return {
            auth:                        {
                username: process.env[ "USERNAME" ]!,
                password: process.env[ "PASSWORD" ]!
            }, connectTimeoutMS:         5000,
            directConnection:            true,
            zlibCompressionLevel:        Compression.$9,
            appName:                     "Document-DB",
            monitorCommands:             true,
            tlsCAFile:                   Path.join( process.cwd(), "rds-combined-ca-bundle.pem" ),
            tls:                         true,
            dbName:                      process.env[ "DATABASE_CURSOR" ]!,
            rejectUnauthorized:          true,
            tlsAllowInvalidHostnames:    true,
            tlsAllowInvalidCertificates: true,
            retryWrites:                 true
        };
    }

    async function Handler(): Promise<import("mongodb").MongoClient | undefined> {
        return new Promise<import("mongodb").MongoClient | undefined>( async ( resolve ) => {
            const Client = await import("mongodb").then( ( Module ) => Module.MongoClient );

            /*** mongodb://localhost:27017 */
            Client.connect( process.env[ "URI" ]!, Connection.settings(), ( exception, connection ) => {
                if ( exception || !( connection ) ) {
                    if ( !( connection ) ) {
                        throw new Error( "Unable to Establish Connection" );
                    }

                    throw exception;
                }

                resolve( connection );
            } );
        } );
    }

    export const Cursor = async function () {
        validate();

        return Handler();
    };

    Cursor.lock = false;

    Cursor.data = Object.create( {} );
    Cursor.options = Object.create( {} );
    Cursor.client = Object.create( {} );
}

export module Stream {
    export const Directory = Path.join( process.cwd(), "archive" );

//    export const Initialize = async (directory: string = Stream.Directory) => {
//        const remove = async () => new Promise( (resolve, reject) => {
//            if ( FS.existsSync( directory ) ) {
//                FS.rm( directory, { recursive: true }, (exception) => {
//                    if ( exception ) reject( exception );
//
//                    resolve( async () => create() );
//                } );
//            } else {
//                resolve( async () => create() );
//            }
//        } );
//
//        const create = async () => new Promise( (resolve, reject) => {
//            FS.mkdir( directory, { recursive: true }, (exception) => {
//                if ( exception ) reject( exception );
//
//                resolve( true );
//            } );
//        } );
//
//        return await remove();
//    };

    /***
     * Base Export Directory
     *
     * @param {string} namespace
     * @return {Promise<string>}
     *
     * @constructor
     */
    export const Archive = async ( namespace: string ) => {
        const create = Util.promisify( FS.mkdir );

        const pathing = namespace.replaceAll( ".", Path.sep );

        const target = Path.join( process.cwd(), "archive", pathing );

        await create( target, { recursive: true } );

        return target;
    };

    /***
     * Raw File Export(s)
     * ---
     *
     * Exports both JSON (UTF-8 Encoded) + BSON (Binary-JSON)
     *
     * @param {Database.Translation} collection
     * @return {Promise<Awaited<string>[]>}
     *
     * @constructor
     */
    export const Raw = async ( collection: Database.Translation ) => {
        const iterator: { count: number, files: Promise<string>[] } = { count: 0, files: [] };

        const { documents } = collection.statistics;
        const { namespace } = collection;

        const archive = await Stream.Archive( namespace );

        for await ( const document of collection.stream ) {
            iterator.count++;

            const hexadecimal = document._id.toString();

            //console.log( "Document" + ":", [ namespace, hexadecimal, "bson" ].join( "." ), "(" + iterator.count + "/" + documents + ")" );
            //const binary = new Promise<string>( (resolve, reject) => {
            //    const target = Path.join( archive, [ hexadecimal, "bson" ].join( "." ) );
            //    FS.writeFile( target, BSON.serialize( document, { serializeFunctions: false, checkKeys: true, ignoreUndefined: false } ), { encoding: "binary" }, (exception) => {
            //        if ( exception ) reject( exception );
            //
            //        resolve( target );
            //    } );
            //} );

            console.log( "Document" + ":", [ namespace, hexadecimal, "json" ].join( "." ), "(" + iterator.count + "/" + documents + ")" );
            await new Promise<string>( ( resolve, reject ) => {
                const target = Path.join( archive, [ hexadecimal, "json" ].join( "." ) );

                /*** Too many files error EMFILE */
                FS.open( target, "w+", 0o666, ( exception, descriptor ) => {
                    if ( exception ) reject( exception );

                    FS.writeFile( target, JSON.stringify( document, null, 4 ), ( exception ) => {
                        if ( exception ) reject( exception );

                        /*** Too many files error EMFILE */
                        FS.close( descriptor, ( exception ) => {
                            if ( exception ) reject( exception );
                        } );

                        resolve( target );
                    } );
                } );
            } ).catch( ( exception: NodeJS.ErrnoException ) => {
                const target = Path.join( archive, [ hexadecimal, "json" ].join( "." ) );

                if ( exception.errno === -24 ) {
                    FS.writeFileSync( target, JSON.stringify( document, null, 4 ) );
                }
            } );
        }
    };

    export const Documents = async ( collection: Database.Translation ) => {
        const iterator: { count: number, files: Promise<string>[] } = { count: 0, files: [] };

        const { documents } = collection.statistics;
        const { namespace } = collection;

        const archive = await Stream.Archive( namespace );

        for await ( const document of collection.stream ) {
            iterator.count++;

            const hexadecimal = document._id.toString();

            console.log( "Document" + ":", [ namespace, hexadecimal, "json" ].join( "." ), "(" + iterator.count + "/" + documents + ")" );
            await new Promise<string>( ( resolve, reject ) => {
                /// const target = Path.join( archive, [ hexadecimal, "json" ].join( "." ) );

                console.log( document );

                resolve( hexadecimal );
            } );
        }
    };
}

export module Database {
    export const collections = async ( connection: import("mongodb").MongoClient ) => {
        const database = connection.db();

        const collections = await database.collections();

        return collections.map( ( collection ) => collection.collectionName );
    };

    export const select = async ( connection: import("mongodb").MongoClient, collection: string ) => {
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
                ... enumeration, ... {
                    worker: parseInt( index ),
                    /*** Pointer Pass-Through */
                    stream:     enumeration.stream, // enumeration.stream.on("data", (chunk: Object) => console.log(chunk)),
                    statistics: {
                        valid:     ( statistics.ok === 1 ),
                        size:      ( statistics.size / 1.024e6 ).toFixed( 3 ) + "MB",
                        storage:   ( statistics.storageSize / 1.024e6 ).toFixed( 3 ) + "MB",
                        documents: statistics.count
                    }
                }
            };
        }

        global[ "storage" ] = ( global[ "storage" ] / 1.024e6 ).toFixed( 3 ) + "MB";
        global[ "size" ] = ( global[ "size" ] / 1.024e6 ).toFixed( 3 ) + "MB";

        return { statistics: global, collections: cursor } as Database.Export;
    };

    export const data = async ( connection: import("mongodb").MongoClient ) => {
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
                ... enumeration, ... {
                    worker: parseInt( index ),
                    /*** Pointer Pass-Through */
                    stream:     enumeration.stream, // enumeration.stream.on("data", (chunk: Object) => console.log(chunk)),
                    statistics: {
                        valid:     ( statistics.ok === 1 ),
                        size:      ( statistics.size / 1.024e6 ).toFixed( 3 ) + "MB",
                        storage:   ( statistics.storageSize / 1.024e6 ).toFixed( 3 ) + "MB",
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
    export type Stream = NodeJS.ReadableStream & AsyncIterable<import("mongodb").WithId<BSON.Document>>;
    export type Translation = { stream: Database.Stream, name: string, database: string, namespace: string, statistics: Database.Statistic };
    export type Export = { statistics: Global, collections: { [ $: Database.Collectable["name"] ]: Database.Translation } };
    export type Collectable = { stream: NodeJS.ReadableStream & AsyncIterable<import("mongodb").WithId<BSON.Document>>, name: string, database: string, namespace: string, statistics: Promise<import("mongodb").CollStats> };
}

export module Manager {
    export const Collection = async ( collection: string ) => {
        const connection = await Connection.Cursor();

        if ( !( connection ) ) {
            throw new Error( "Uncaught Connection Error" );
        }

        const data = await Database.select( connection, collection );

        console.time( "Export" + " " + collection );
        await Stream.Raw( data.collections[ collection ]! );
        /// await Stream.Documents(data.collections[collection]!);
        console.timeEnd( "Export" + " " + collection );

        await connection.close();
    };

    export const Setup = async () => {
        // TLS.Setup();

        const { spawn } = await import("child_process");

        const proxy = [ process.env[ "LOCAL_PORT" ], process.env[ "DATABASE_HOSTNAME" ], process.env[ "DATABASE_PORT" ] ].join( ":" );
        const bastion = [ process.env[ "BASTION_USERNAME" ], process.env[ "BASTION_HOSTNAME" ] ].join( "@" );

        const parameters: Readonly<[ "-L", string, string, "-i", string, "-N" ]> = [ "-L", proxy, bastion, "-i", process.env[ "BASTION_KEY" ]!, "-N" ];

        const subprocess = spawn( "ssh", parameters, {
            shell: false, stdio: "ignore", detached: true
        } );

        /***
         * By default, the parent will wait for the detached child to exit. To
         * prevent the parent from waiting for a given subprocess to exit, use
         * the subprocess.unref() method. Doing so will cause the parent's event
         * loop to not include the child in its reference count, allowing the
         * parent to exit independently of the child, unless there is an established
         * IPC channel between the child and the parent.
         */
        subprocess.unref();

        process.on( "exit", () => {
            subprocess.kill( "SIGTERM" );

            // TLS.Clean();
        } );

        return await new Promise<import("child_process").ChildProcess>( ( resolve ) => {
            subprocess.on( "spawn", async () => {
                await Primary();

                resolve( subprocess );
            } );
        } );
    };

    export const Master = async () => {
        const container = new WeakSet();

        const connection = await Connection.Cursor();

        if ( !( connection ) ) {
            throw new Error( "Uncaught Connection Error" );
        }

        const collections = ( await Database.collections( connection ) )
            .filter( ( collection ) => !( collection.includes( "edgate" ) ) );

        for ( const collection of collections ) {
            const fork = cluster.fork() as import("cluster").Worker;

            Reflect.set( fork!, "collection", collection );

            container.add( fork );
        }

        await connection.close();

        const exits = { count: 0 };
        cluster.on( "exit", async ( worker: import("cluster").Worker, code, signal ) => {
            exits.count++;

            if ( exits.count === [ ... collections.keys() ].length ) {
                process.emit( "exit", 0 );
            }
        } );
    };

    export const Primary = async () => {
        await Manager.Master();

        if ( cluster.workers ) {
            for ( const [ identifier, worker ] of Object.entries( cluster.workers ) ) {
                const collection = Reflect.get( worker!, "collection" );
                worker!.process.send( { emission: "collect", collection } );
            }
        }

        process.addListener( "message", ( event ) => {
            console.log( event );
        } );
    };

    export const Evaluate = async () => {
        if ( cluster.isPrimary ) {
            await Manager.Setup();
        } else if ( cluster.isWorker ) {
            const worker = cluster.worker;

            console.log( "Worker", "(" + process.pid + ")", "Successfully Started" );

            worker?.process.on( "collect", async ( collection: string ) => {
                await Manager.Collection( collection );

                process.exit( 0 );
            } );

            worker?.process?.on( "message", ( message: object & { origin: string, emission: string, collection: string } ) => {
                console.log( "Worker", "(" + process.pid + ")", message );

                if ( message.emission === "collect" && message?.collection ) {
                    worker?.process.emit( "collect", message.collection );
                }
            } );
        }
    };
}

( async () => Manager.Evaluate() )();

