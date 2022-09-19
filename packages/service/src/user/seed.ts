import FS from "fs";

import crypto from "crypto";
import { faker } from "@faker-js/faker";
import Path from "path";
import { Context } from "@iac-factory/api-database";

import { TLS } from "@iac-factory/api-schema";

const Blob = FS.readFileSync( Path.join( __dirname, "./tls-ca-certificates.json" ), { encoding: "utf-8" } );
const Certificates: TLS.CA = { ... JSON.parse( Blob ) };

for ( const [ certificate, offset ] of Object.entries( Certificates ) ) {
    const filename = [ certificate, "pem" ].join( "." );
    const target = Path.join( __dirname, filename );
    const buffer = Buffer.from( ( offset as string ), "base64" );

    const content = buffer.toString( "ascii" );

    FS.writeFileSync( target, content );
}

FS.writeFileSync( Path.join( __dirname, "us-east-2-bundle.pem" ), Certificates[ "us-east-2-bundle" ] );

export async function Hash( user: User.Type, state: { total: number, users: number, ceiling: number } ) {
    const C = await import("bcryptjs");
    return await new Promise<User.Type>( ( resolve ) => {
        C.genSalt( 5, function ( error, salt ) {
            if ( error ) throw error;
            C.hash( user.password, salt, function ( error, hash ) {
                if ( error ) throw error;
                user.password = hash; // Override Plaintext Password with Updated Hash

                resolve( user );
            }, async ( percent ) => {
                ( percent === 1.0 ) && state.users++;

                const output = String( Number( ( state.users / state.ceiling ) * 100 ).toFixed( 3 ) + "%" + " " + "(" + state.users + "/" + state.ceiling + ")" );
                await new Promise( ( resolve ) => {
                    setTimeout( () => {
                        process.stdout.clearLine( 0 );
                        process.stdout.cursorTo( 0 );
                        process.stdout.write( output );

                        resolve( void 0 );
                    }, 100 );
                } );
            } );
        } );
    } );
}

export module User {
    const state = { total: 0, users: 0, ceiling: 0 };
    export type State = { total: number, users: 0, ceiling: number }

    export function seed( entropy: number, ceiling: number ) {
        state.total = entropy;
        state.ceiling = ceiling;

        faker.seed( ceiling );
    }

    export const Administrator = async (): Promise<( User.Type )> => {
        const user = {
            id:            faker.datatype.uuid(),
            email:         "administrator@internal.io",
            description:   faker.lorem.sentences( 1 ),
            avatar:        faker.internet.avatar(),
            comment:       [
                "Initial Seeded Administrator"
            ],
            username:      "administrator",
            password:      "Kn0wledge!",
            rotation:      null,
            administrator: true,
            manager:       faker.datatype.boolean(),
            login:         {
                date:       null,
                expiration: null,
                origin:     "127.0.0.1"
            },
            role:          faker.datatype.number( 16 ),
            /*** Generate Arbitrary Entitlements from Company Buzzword(s) (Nouns) */
            entitlements: [
                "Markdown-Editor",
                "User-Administration",
                "Login"
            ],
            version:      faker.system.semver(),
            creation:     new Date( Date.now() ),
            modification: new Date( Date.now() ),
            name:         [ "Jacob", "Sanders" ].join( " " )
        };

        return await Hash( user, state );
    };

    async function create(): Promise<User.Type> {
        const first = faker.name.firstName();
        const last = faker.name.lastName();

        const user = {
            id:            crypto.randomUUID({ disableEntropyCache: true }),
            email:         faker.internet.email( first, last ),
            description:   faker.lorem.sentences( 1 ),
            avatar:        faker.internet.avatar(),
            comment:       [ faker.random.word(), faker.random.word(), faker.random.word() ],
            administrator: false,
            username:      faker.internet.userName( first, last ),
            password:      faker.internet.password( 16 ),
            rotation:      faker.date.future( 1 ),
            login:         {
                date:       faker.date.past( 1 ),
                expiration: faker.date.soon( 1 ),
                origin:     faker.internet.ip()
            },
            role:          faker.datatype.number( 16 ),
            /*** Generate Arbitrary Entitlements from Company Buzzword(s) (Nouns) */
            entitlements: [ ... new Set(
                [ ... Array.from( { length: crypto.randomInt( 5 ) } ).map( () => {
                    const word = faker.company.bsNoun();
                    const capital = word[ 0 ]!.toUpperCase();
                    return [ capital, word.slice( 1 ) ].join( "" ).replace( " ", "-" );
                } ), ... Array.from( { length: crypto.randomInt( 5 ) } ).map( () => {
                    const word = faker.company.bsBuzz();
                    const capital = word[ 0 ]!.toUpperCase();
                    return [ capital, word.slice( 1 ) ].join( "" ).replace( " ", "-" );
                } ) ]
            ) ],
            version:      faker.system.semver(),
            creation:     new Date( Date.now() ),
            modification: new Date( Date.now() ),
            name:         [ first, last ].join( " " )
        };

        return await Hash( user, state );
    }

    export async function generate( total: number, ceiling: number ) {
        if ( state.total === 0 || !state.total ) {
            throw new Error( "Data Must be Seeded" );
        }

        console.debug( "[Debug] Creating User(s) ..." );

        const iterator = Array.from( { length: ceiling } );

        const users: User.Type[] = [];

        for await ( const index of iterator ) {
            users.push( await create() );
        }

        return users;
    }

    export interface Type {
        id: string;
        avatar: string;
        description: string;
        email: string;
        username: string;
        password: string;
        rotation: Date | null;
        administrator: boolean,
        comment: string[],
        login: {
            date: Date | null,
            expiration: Date | null,
            origin: string
        };
        role: number;
        entitlements: string[];
        creation: Date;
        modification: Date;

        name: string;
        version: string;

        // "data-export": {
        //     exports: Date[];
        //     "rate-limited": boolean;
        // }
    }
}

export const Inject = async ( settings: { files: number, users: number } ) => {
    const database = "Authentication";
    const collection = "User";
    const seed = async () => {
        User.seed( settings.users, settings.users * settings.files );

        const Iterate = async ( index: number ) => {
            const target = Path.join( __dirname, [ "Users", index, "json" ].join( "." ) );
            const exists = FS.existsSync( target );

            if ( !( exists ) ) {
                console.time( [ "User-File-Write", index ].join( "-" ) );

                const users = JSON.stringify( await User.generate( settings.users, settings.users * settings.files ), null, 4 );

                FS.writeFileSync( target, users );

                process.stdout.write( "\n" );

                console.timeEnd( [ "User-File-Write", index ].join( "-" ) );
            }

            return target;
        };

        const iterator = Array.from( { length: settings.files } ).map( ( _, index ) => index );

        const files: string[] = [];
        for await ( const index of iterator ) {
            const file = await Iterate( index );

            files.push( file );
        }

        return files;
    };

    const files = await seed();

    const connection: import("mongodb").MongoClient = await Context.Connection();

    const DB = { connection: connection.db( database ) }

    const { collections } = await new Promise<{ collections: number, db: string }>( ( resolve ) => DB.connection.stats( ( exception, result ) => {
        if ( exception ) {
            console.trace( exception );
        }

        resolve( result as { collections: number, db: string } );
    } ) );

    if ( collections === 0 ) {
        await new Promise( ( resolve ) => DB.connection.createCollection( collection, async ( exception, insertion ) => {
            if ( exception || !( insertion ) ) throw exception;

            await DB.connection.collection( collection ).createIndex(
                { username: 1, id: 1, email: 1 },
                {
                    unique: true,
                    name:   "Account-Unique-Indexes"
                }
            );

            await DB.connection.collection( collection ).createIndex( {
                name:        "text",
                description: "text",
                comment:     "text"
            }, {
                name:       "Text-Search-Indexes",
                background: true,
                weights:    {
                    name:        3,
                    description: 2,
                    comment:     1
                }
            } );

            await DB.connection.collection( collection ).createIndex( {
                title: 1
            }, {
                name:       "Administrator-Indexes",
                background: true
            } );

            await DB.connection.collection( collection ).createIndex( {
                creation:     1,
                modification: 1
            }, {
                name:       "Datetime-Indexes",
                background: true
            } );

            // await DB.connection.collection( collection ).createIndex( {
            //     "login.origin":       "text",
            //     "login.modification": "text",
            //     "login.expiration":   "text"
            // }, {
            //     name:       "Login-Indexes",
            //     background: true,
            //     weights:    {
            //         "login.origin":       3,
            //         "login.modification": 2,
            //         "login.expiration":   1
            //     }
            // } );

            resolve( true );
        } ) );

        const administrator = await User.Administrator();

        const insertion = await new Promise<( { document?: import("mongodb").InsertOneResult<import("mongodb").Document> } & { acknowledged: boolean } )>( ( resolve, reject ) => {
            DB.connection.collection( collection ).insertOne( administrator, {
                dbName:          DB.connection.databaseName,
                ignoreUndefined: false
            }, ( exception, document ) => {
                if ( exception || !( document ) ) reject( exception );

                resolve( { ... document, acknowledged: true } );
            } );
        } ).catch( ( exception ) => {
            throw exception;
        } );

        const { acknowledged } = insertion;

        ( acknowledged ) && console.debug( "[Debug] Successful Insertion" );
        if ( !( acknowledged ) ) {
            throw new Error( "[Error] Exception Creating Administrator User" );
        }

        for await ( const file of files ) {
            await new Promise( ( resolve, reject ) => {
                FS.readFile( file, { encoding: "utf-8" }, async ( exception, data ) => {
                    if ( exception ) throw exception;

                    const users: User.Type[] = JSON.parse( data );

                    for await ( const user of users ) {
                        try {
                            const insertion = await new Promise<( { document?: import("mongodb").InsertOneResult<import("mongodb").Document> } & { acknowledged: boolean } )>( ( resolve, reject ) => {
                                DB.connection.collection( collection ).insertOne( user, {
                                    dbName:          DB.connection.databaseName,
                                    ignoreUndefined: false
                                }, ( exception, document ) => {
                                    if ( exception || !( document ) ) reject( exception );

                                    resolve( { ... document, acknowledged: true } );
                                } );
                            } ).catch( ( exception ) => {
                                throw exception;
                            } );

                            const { acknowledged } = insertion;

                            ( acknowledged ) && console.debug( "[Debug] Successful Insertion" );

                            ( acknowledged ) && ( resolve( user ) );

                            ( acknowledged ) || ( reject( user ) );
                        } catch ( exception ) {
                            // console.warn( "[Warning] Caught Insertion Exception", exception );
                        }
                    }
                } );
            } );
        }
    } else {
        await new Promise( ( resolve, reject ) => {
            DB.connection.dropDatabase( { dbName: database }, ( exception, data ) => {
                if ( exception ) {
                    console.trace( exception );

                    return reject( exception );
                }

                resolve( data );
            } );
        } );
        //
        // await new Promise( ( resolve, reject ) => DB.connection.createCollection( collection, ( exception, result ) => {
        //     if ( exception ) {
        //         console.trace( exception );
        //
        //         return reject( exception );
        //     }
        //
        //     resolve( result );
        // } ) );
        //
        // void await Inject( settings );
    }
};

void ( async () => {
    const debug = ( process.argv.includes( "--debug" ) && process.argv.includes( "--db" ) && process.argv.includes( "--user-seed" ) );

    const test = async () => {
        const { Inject } = await import(".");

        await Inject( {
            files: 10,
            users: 100
        } );
    };

    /// Throw a System-Failure-Capable Error
    if ( debug && process.env[ "NODE_ENV" ] === "production" ) {
        process.exitCode = 255;

        throw Error( "Fatal-Environment-Exception - Unsupported Operation in Non-Development Context" );
    }
    ( debug ) && await test();
} )();

