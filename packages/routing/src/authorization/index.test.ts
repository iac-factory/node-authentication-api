const cookieParser = require( "cookie-parser" );

import { Logger } from "@iac-factory/api-authentication-utilities";

import * as Should from "should";

import Request from "supertest";
import Application from "@iac-factory/api-authentication-services";

const Debugger = new Logger("Routing");

describe( "request.agent(app)", function () {
//
//
//    app.get( "/", function ( req, res ) {
//        res.cookie( "cookie", "hey" );
//        res.send();
//    } );
//
//    app.get( "/return", function ( req, res ) {
//        if ( req.cookies.cookie ) res.send( req.cookies.cookie );
//        else res.send( ":(" )
//    } );
//
//    const agent = Request.agent( app );

    test("Router (Schema) Import", async function () {
        const { Schema } = await import(".");

        Debugger.debug("Schema", { Schema });

        expect(Schema).toBeTruthy();
    });

    test("Router (Controller) Import", async function () {
        const Controller = await import(".").then((router) => router.default );

        Debugger.debug("Router", { Controller });

        expect(Controller).toBeTruthy();
    });
//
//    it( "should save cookies", function ( done ) {
//        agent
//            .get( "/" )
//            .expect( "set-cookie", "cookie=hey; Path=/", done );
//    } );
//
//    it( "should send cookies", function ( done ) {
//        agent
//            .get( "/return" )
//            .expect( "hey", done );
//    } );
} );