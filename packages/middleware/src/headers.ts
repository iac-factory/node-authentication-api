import { Debugger } from "..";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

const Overwrites = [
    {
        Key:   "Content-Type",
        Value: "Application/JSON"
    },
    {
        Key:   "Server",
        Value: "Nexus-API"
    }
];

export const Headers = ( server: Application, headers = Overwrites ) => {
    Debugger.debug("Initialization", "Establishing Default HTTP Header(s) ...");

    const fn = ( _: Request, response: Response, callback: NextFunction ) => {
        headers.forEach( ( Element ) => {
            response.set( Element.Key, Element.Value );
        } );

        callback();
    };

    server.use( fn );
};

export default Headers;
