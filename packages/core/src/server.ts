import Network from "net";

import { Router } from "@iac-factory/api-routing";
import { Middleware } from "@iac-factory/api-middleware";
import { Application } from "@iac-factory/api-services";
import { Address } from "@iac-factory/api-utilities";
import { Logger } from "@iac-factory/api-utilities";

import { Server } from ".";

const Debugger = new Logger( "Core" );

export async function Initialize() {
    await Middleware( Application );

    Application.use( "/", Router );
    /*** Inline Type `settings` for HTTP-Listen Event Listener */
    const HTTP: [ number, string, number ] = [
        Address.port,
        Address.hostname,
        parseInt( process.env[ "SERVER_BACKLOG" ] ?? "512" )
    ];

    const Instance = ( await Server() );

    return new Promise( ( resolve ) => {
        Instance.listen( ... HTTP, function HTTP() {
            Debugger.debug( "Server", Address.url, {
                ... ( Instance.address() as Network.AddressInfo )
            } );

            resolve( Application );
        } );
    } );
}