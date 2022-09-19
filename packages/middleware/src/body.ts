import { Debugger } from "..";

import { json, urlencoded } from "body-parser";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

/***
 * @type {{"URL-Encoded": {Parameters: {extended: boolean, parameterLimit: number}, Module: (options?: bodyParser.OptionsUrlencoded) => createServer.NextHandleFunction}, JSON: {Parameters: {strict: boolean}, Module: (options?: bodyParser.OptionsJson) => createServer.NextHandleFunction}}}
 */
const Parsers = {
    "URL-Encoded": {
        Module:     urlencoded,
        Parameters: {
            extended:       true,
            parameterLimit: 1000
        }
    },
    "JSON":        {
        Module:     json,
        Parameters: {
            strict: false
        }
    }
};

/*** Body Middleware Loader
 *
 * @param server {Application}
 *
 *
 * @return {Application}
 *
 * @constructor
 *
 */

export const Body = ( server: Application ): Application => {
    for ( const [ parser, module ] of Object.entries( Parsers ) ) {
        // Logger.debug("Adding Module" + " " + parser + " " + "...");

        const { Module } = module;
        const { Parameters } = module;

        server.use( Module( Parameters ));
    }

    /// console.debug( "[Middleware] [Body-Parser] [Debug] Overwrote Application Request + Response Parser(s)" );

    return server;
};

export default Body;
