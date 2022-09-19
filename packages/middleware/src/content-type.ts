import { Debugger } from "..";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

/***
 * Content-Type
 * ---
 *
 * `Application/JSON` Content-Type Middleware
 *
 * @constructor
 *
 */

export const Set = ( server: Application ) => {
    server.use( async ( request, response, callback ) => {
        response.set( "Content-Type", "Application/JSON" );

        ( callback ) && callback();
    } );

    return server;
};

export default Set;

