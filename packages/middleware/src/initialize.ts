import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

export const Initialize = ( server: Application ) => {
    server.init();

    server.disable( "etag" );
    server.disable( "view" );
    server.disable( "views" );
    server.disable( "x-powered-by" );

    return server;
};

export default Initialize;
