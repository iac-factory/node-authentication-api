import HTTP from "http";

import { Router } from "@iac-factory/api-routing";
import { Middleware } from "@iac-factory/api-middleware";
import { Application } from "@iac-factory/api-services";
import { Logger } from "@iac-factory/api-utilities";

import { Server } from ".";

const Debugger = new Logger( "Core" );

export async function Initialize(): Promise<HTTP.Server> {
    await Middleware( Application );

    Application.use( "/", Router );
    /*** Inline Type `settings` for HTTP-Listen Event Listener */
    const HTTP: [ number, string, number ] = [
        parseInt(process.env["SERVER_PORT"] ?? "3000"),
        process.env["SERVER_HOSTNAME"] ?? "0.0.0.0",
        parseInt( process.env[ "SERVER_BACKLOG" ] ?? "512" )
    ];

    const Instance = ( await Server() );

    return new Promise( ( resolve ) => {
        Instance.listen( ... HTTP, function HTTP() {
            Debugger.debug( "Server", "Now Listening via http://localhost:3000");
            // Debugger.debug( "Server", Address.url, {
            //     ... ( Instance.address() as Network.AddressInfo )
            // } );

            resolve( Application );
        } );
    } );
}