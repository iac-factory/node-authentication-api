import { Application } from "@iac-factory/api-authentication-services";
import { Logger } from "@iac-factory/api-authentication-utilities";

import Test from "supertest";
import { json, urlencoded } from "body-parser";
import Router, { Endpoint, Operation } from ".";

const Debugger = new Logger( "Routing" );

module Middleware {
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

    export const Body = ( server: typeof Application ): typeof Application => {
        for ( const [ parser, module ] of Object.entries( Parsers ) ) {
            // Logger.debug("Adding Module" + " " + parser + " " + "...");

            const { Module } = module;
            const { Parameters } = module;

            server.use( Module( Parameters ));
        }

        /// console.debug( "[Middleware] [Body-Parser] [Debug] Overwrote Application Request + Response Parser(s)" );

        return server;
    };
}

describe( Operation, function () {
    Middleware.Body(Application);

    Application.use(Router);

    const Agent = Test.agent( Application );

    test( "Open-API (Operation-ID) Import", async () => {
        const { Operation } = await import(".");

        Debugger.debug( "Operation-ID", { Operation } );

        expect( Operation ).toBeTruthy();
    } );

    test( "Router (Endpoint) Import", async () => {
        const { Endpoint } = await import(".");

        Debugger.debug( "Router Endpoint", { Endpoint } );

        expect( Endpoint ).toBeTruthy();
    } );

    test( "Router (Schema) Import", async () => {
        const { Schema } = await import(".");

        Debugger.debug( "Router, Open-API Schema", { Schema } );

        expect( Schema ).toBeTruthy();
    } );

    test( "Router (Controller) Import", async () => {
        const { Router } = await import(".");

        expect( Router ).toBeTruthy();
    } );

    test( "Authorized Response via Credentials in Request Body", async () => {
        await Agent.post( Endpoint.route ).send( {
            username: "administrator",
            password: "Kn0wledge!",
        } ).type("Application/JSON")
            .expect(200);
    } );

//    request.auth( "my_token", { type: "bearer" } )

} );
