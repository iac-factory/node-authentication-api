import { Debugger } from "..";

import Compression from "compression";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

/***
 * Compression Middleware Loader
 *
 * @param server {Application}
 *
 * @returns {Application}
 *
 * @constructor
 *
 */

export const Compress = ( server: Application ) => {
    server.use( Compression() );

    return server;
};

export default Compress;
