import { Debugger } from "..";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

export const Initialize = ( server: Application ) => {
    Debugger.debug("Initialization", "Setting Application Settings ...");

    server.init();

    server.disable( "etag" );
    server.disable( "view" );
    server.disable( "views" );
    server.disable( "x-powered-by" );

    return server;
};

export default Initialize;
