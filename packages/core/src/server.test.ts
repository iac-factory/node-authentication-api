/**
 * @jest-environment node
 */

import Hydrate from "@iac-factory/unit-testing";

import { Initialize } from "./server";
import { Server } from "./socket";

describe( "Server Unit-Test", function () {
    Hydrate();

    beforeAll( function () {
        process.env[ "SERVER_PORT" ] = "3000";
    }, 30000 );

    afterEach( async function () {
        const Instance = await Server( false );

        Instance.emit( "kill" );
    } );

    it( "Starts the HTTP Application Server", async function () {
        const Application = await Initialize().catch( async ( exception ) => {
            if ( exception ) {
                console.trace( exception );

                throw exception;
            }
        } );

        expect( Application ).toBeTruthy();
    } );
} );
