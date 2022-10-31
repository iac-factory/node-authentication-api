import Application from "@iac-factory/api-authentication-services";
import { Logger } from "@iac-factory/api-authentication-utilities";

import Test from "supertest";
import Router, { Endpoint, Operation } from ".";

const Debugger = new Logger( "Routing" );

describe( Operation, function () {
    Application.use( Router );

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

    test( "Unauthorized Response via Credentials in Request Body", async () => {
        await Agent.post( Endpoint.route ).send( {
            username: "administrator",
            password: "Kn0wledge!",
        } ).type("Application/JSON")
            .expect(401);
    } );
} );
