import { Debugger } from "@iac-factory/api-authentication-routing";

import Router, { Endpoint, Schema, Operation } from "./definition";

import { Default, JWT } from "@iac-factory/api-authentication-services";

Router.post( Endpoint.route, async ( request, response, next ) => {
    const { authorization } = request.headers;

    (function Body () {
        Debugger.debug(Operation, request.body);
    })();

    (function Headers () {
        Debugger.debug(Operation, request.headers);
    })();

    const referrer = request.get("referrer");

    const { username } = request.body ?? { username: null };
    const { password } = request.body ?? { password: null };

    const error = ( !(username) || !(password) );

    const server = request.protocol + "://" + request.hostname;

    const authorized = ( token: string ) => {
        response.status( 200 );
        response.set( "Content-Type", "Application/JWT" );
        response.send( token );
    };

    const unauthorized = () => {
        response.status( 401 );
        response.set( "WWW-Authenticate", "Token-Exchange" );
        response.send( { exception: "Invalid Username & Password Combination" } );
    };

    const parameters = [
        request.get( "origin" ) ?? server,
        request.ip,
        referrer,
        username,
        password
    ] as const;

    const token = ( !error ) ? await JWT( ... parameters ) : null;

    ( token ) && authorized( token );
    ( token ) || unauthorized();
} );

const Information = Default.Response();
Router.all( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export { Router };
export { Endpoint };
export { Operation };
export { Schema };

export default Router;