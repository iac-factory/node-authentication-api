import { Controller, Schema } from "@iac-factory/api-authentication-services";

export const Router = Controller( "IaC.Factory.API" );

// Applies to All Routes
// Router.use( "/:route", async (request, response, next) => {
//     next()
// });
//
// Router.param( "route", (request, response, next) => {
//     console.log(Router);
//
//     next();
// } );

// Router.use( "/:Authorization", async (request, response, next) => {
//     next();
// } );
//
// Router.param( "Authorization", async (request, response, next) => {
//     const { authorization } = request.headers;
//
//     const basic = ( authorization ) ? authorization.split( " " ).pop() : null;
//
//     const credentials = ( basic ) ? Buffer.from( basic, "base64" ).toString( "utf-8" ).split( ":" ) : null;
//
//     const { username } = ( credentials ) ? { username: credentials[ 0 ] } : request.body ?? { username: null };
//     const { password } = ( credentials ) ? { password: credentials[ 1 ] } : request.body ?? { password: null };
//
//     const error = ( !username || !password );
//
//     const server = request.protocol + "://" + request.hostname;
//
//     const unauthorized = () => {
//         response.status( 401 );
//         response.set( "WWW-Authenticate", "Token-Exchange" );
//         response.send( "Invalid Username & Password Combination" );
//     };
//
//     const parameters = [ request.get( "origin" ) ?? server, request.ip, username, password ] as const;
//
//     const token = ( !error ) ? await JWT( ... parameters ) : null;
//
//     ( token ) && next();
//     ( token ) || unauthorized();
// } );

Router.get( "/", async ( request, response ) => {
    response.status( 200 ).send( Schema );
} );

export default Router;

void import("./routes");

export interface Dictionary {
    [ key: string ]: string;
}

export type Parameters = Dictionary;

export interface Handler<Parameter = Dictionary,
    Locals extends Record<string, any> = Record<string, any>> {
    ( callable: { dictionary: Dictionary, locals: Locals } ): void;
}
