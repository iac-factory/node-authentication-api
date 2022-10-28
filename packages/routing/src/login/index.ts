import { Default, JWT } from "@iac-factory/api-authentication-services";
import { Endpoint, Router } from "./definition";
import { Response } from "express-serve-static-core";

Router.post( Endpoint.route, async ( request, response ) => {
    const { authorization } = request.headers;

    const basic = ( authorization ) ? authorization.split( " " ).pop() : null;

    const credentials = ( basic ) ? Buffer.from( basic, "base64" ).toString( "utf-8" ).split( ":" ) : null;

    const { username } = ( credentials ) ? { username: credentials[ 0 ] } : request.body ?? { username: null };
    const { password } = ( credentials ) ? { password: credentials[ 1 ] } : request.body ?? { password: null };

    const error = ( !username || !password );

    const server = request.protocol + "://" + request.hostname;

    const unauthorized = ( response: Response<any, Record<string, any>, number> | void ) => response?.status( 401 ).set( "WWW-Authenticate", "Token-Exchange" ).send( "Invalid Username & Password Combination" );

    const token = ( !error ) ? await JWT( server, request.ip, request.get( "origin" ) ?? server, username, password )
        : unauthorized( response );

    ( token && !error ) && response.status( 200 ).set( "Content-Type", "Application/JWT" ).send( token );
} );

const Information = Default.Response();
Router.all( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export default Router;

