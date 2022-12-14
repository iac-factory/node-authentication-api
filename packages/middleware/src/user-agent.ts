import { Debugger } from "..";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

/*** User-Agent Middleware Loader
 *
 * @param server {Application}
 *
 * @return {Application}
 *
 * @constructor
 *
 */

export const Agent = ( server: Application ) => {
    Debugger.debug("Initialization", "Adding User-Agent Middleware ...");

    /***
     * User-Agent Middleware Function
     *
     * @param {Request} request
     * @param {Response} response
     * @param {Callback} callback
     *
     * @constructor
     *
     */
    const UA = ( request: Request, response: Response, callback: NextFunction ) => {
        Reflect.set( response.locals, "user-agent", request.get( "User-Agent" ) );

        (function Agent() {
            void Debugger.debug("Metadata", { "User-Agent": response.locals["user-agent"], URL: request.url });
        })();

        callback();
    };

    server.use( UA );

    return server;
};

export default Agent;
