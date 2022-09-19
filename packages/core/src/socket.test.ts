/**
 * @jest-environment node
 */

import Hydrate from "@iac-factory/unit-testing";

import { Server } from "./socket";

describe( "Socket Unit-Test", function () {
    Hydrate();

    beforeAll( function () {
        process.env[ "SERVER_PORT" ] = "3000";
    }, 30000 );

    afterEach( async function () {
        const Instance = await Server( false );

        Instance.emit( "kill" );
    } );

    it( "Starts the HTTP Socket Server", async function () {
        const Instance = await Server( true );

        expect( Instance ).toBeTruthy();
    } );

} );
