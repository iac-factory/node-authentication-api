import Path from "path";
import FS from "fs";
import Utility from "util";

import { Schema } from "..";

import type { Response } from "express";

export module Default {
    export type Type = {
        initialized: boolean,
        definition: {
            [ $: string ]: object
        }
    }

    export const Base = (): Type => {
        return {
            initialized: false,
            definition:  {}
        } as Type;
    };

    export const Response = () => {
        return new Proxy( {
            ... Base(),
            evaluate: function ( this: any, path: string, response: Response, schema = Schema ) {
                if ( this.initialized ) {
                    response.status( 200 ).send( {
                        Schema: this
                    } );
                } else {
                    const endpoints = Object.keys( schema[ "paths" ] ?? {} ).filter( ( schema ) => schema.startsWith( path ) );

                    endpoints.forEach( ( endpoint ) => {
                        if ( schema[ "paths" ] && schema[ "paths" ][ endpoint ] ) {
                            this[ "definition" ][ endpoint ] = schema[ "paths" ][ endpoint ];
                        }
                    } );

                    this.initialized = true;

                    response.status( 200 ).send( {
                        Schema: this
                    } );
                }
            }
        }, {} );
    };
}

/*** @deprecated */
export const Directory = ( location: string ) => {
    const extension = ( location ) ? Path.extname( location ) : null;

    location = ( extension === ".ts" || extension === ".js" )
        ? ( location ) ? Path.dirname( location ) : location
        : location;

    const directory = ( location ) ? location : Path.dirname( __filename );

    const directories = FS.readdirSync( directory, {
        withFileTypes: true,
        encoding:      "utf-8"
    } );

    return directories.map( ( descriptor ) => {
        return ( descriptor.isDirectory() )
            ? descriptor.name : null;
    } ).filter( ( handler ) => handler );
};

Utility.deprecate( () => Directory, "Usage of the Default Response Object \"Directory\" is Deprecated" );

export default Directory;