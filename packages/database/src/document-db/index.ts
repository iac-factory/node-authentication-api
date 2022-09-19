import OS from "os";
import FS from "fs";
import Path from "path";

import { TLS } from "@iac-factory/api-tls-certificates";

import { Logger } from "@iac-factory/api-utilities";
import { MongoClient } from "mongodb";

/***
 * @constructor
 */
const URI = () => {
    switch ( OS.platform() ) {
        case "darwin": {
            /*** Development Runtime or Local Workload */
            return process.env[ "DOCUMENTDB_URI" ] as string;
        }
        case "linux": {
            /*** Local Container Runtime */
            return process.env[ "OVERRIDE_DOCUMENTDB_URI" ] as string;
        }
        case "win32": {
            /*** Development Runtime or Local Workload */
            return process.env[ "DOCUMENTDB_URI" ] as string;
        }
        case "openbsd": {
            /*** Development Runtime or Local Workload */
            return process.env[ "DOCUMENTDB_URI" ] as string;
        }
        default: {
            throw new Error( "Unsupported Operating System" );
        }
    }
};

export module Context {
    const state: { connection: null | import("mongodb").MongoClient } = { connection: null };

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
        "$9" = 9,
    }

    export type Level = keyof typeof Compression;

    export const Connection = async function (): Promise<MongoClient> {
        const logger = new Logger( "Document-DB" );

        const validator = new RegExp( "^(mongodb:(?:\\/{2})?)((\\w+?):(\\w+?)@|:?@?)(\\S+?):(\\d+)(\\/(\\S+?))?(\\?replicaSet=(\\S+?))?$", "gm" );

        const options: import("mongodb").MongoClientOptions = {
            auth:                     {
                username: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_USERNAME" ] : undefined,
                password: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_PASSWORD" ] : undefined
            },
            serverSelectionTimeoutMS: 2000,
            connectTimeoutMS:         5000,
            directConnection:         true,
            // replicaSet: "rs0",
            // tlsCAFile: ( process.env[ "DOCUMENTDB_ENABLE_TLS" ] === "true" ) ? Path.join( __dirname, "us-east-2-bundle.pem" ) : undefined,
            // tls: ( process.env[ "DOCUMENTDB_ENABLE_TLS" ] === "true" ),
            // tlsAllowInvalidHostnames: true,
            // tlsAllowInvalidCertificates: true,
            // retryWrites: false
        } as const;

        // settings.options = options;

        // validator.test( (URI) ? URI : "" ) || ( () => {
        //     console.log( "Error - Invalid URI" );
        //     process.exit( 1 );
        // } )();

        async function Handler() {
            const { MongoClient: Client } = await import("mongodb");

            if ( !( state.connection ) ) {
                logger.debug( "Connection-Handler", "Creating New Connection ..." );
                const instance = new Client( URI(), options );
                await instance.connect()

                state.connection = instance;
            }

            return state.connection;
        }

        return await Handler().catch( ( exception ) => {
            console.trace( exception, options );

            throw exception;

        } );
    };
}

export module DDB {
    const state: { connection: null | import("mongodb").MongoClient } = { connection: null };

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
        "$9" = 9,
    }

    export type Level = keyof typeof Compression;

    export const Connection = async function () {
        const logger = new Logger( "Document-DB" );

        const validator = new RegExp( "^(mongodb:(?:\\/{2})?)((\\w+?):(\\w+?)@|:?@?)(\\S+?):(\\d+)(\\/(\\S+?))?(\\?replicaSet=(\\S+?))?$", "gm" );

        const options: import("mongodb").MongoClientOptions = {
            auth:                     {
                username: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_USERNAME" ] : undefined,
                password: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_PASSWORD" ] : undefined
            },
            serverSelectionTimeoutMS: 2000,
            connectTimeoutMS:         5000,
            directConnection:         true,
            // replicaSet: "rs0",
            // tlsCAFile: ( process.env[ "DOCUMENTDB_ENABLE_TLS" ] === "true" ) ? Path.join( __dirname, "us-east-2-bundle.pem" ) : undefined,
            // tls: ( process.env[ "DOCUMENTDB_ENABLE_TLS" ] === "true" ),
            // tlsAllowInvalidHostnames: true,
            // tlsAllowInvalidCertificates: true,
            // retryWrites: false
        } as const;

        // settings.options = options;

        // validator.test( (URI) ? URI : "" ) || ( () => {
        //     console.log( "Error - Invalid URI" );
        //     process.exit( 1 );
        // } )();

        async function Handler() {
            const { MongoClient: Client } = await import("mongodb");

            if ( !( state.connection ) ) {
                logger.debug( "Connection-Handler", "Creating New Connection ..." );
                const instance = new Client( "mongodb://127.0.0.1:27017", options );
                await instance.connect()

                state.connection = instance;
            }

            return state.connection;
        }

        return await Handler().catch( ( exception ) => {
            console.trace( exception, options );

            throw exception;
        } );
    };

    export const Health = async function () {
        try {
            return !!( await Connection() )
        } catch ( exception ) {
            return false;
        }
    };
}

export default Context;

