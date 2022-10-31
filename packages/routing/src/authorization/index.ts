import { Debugger } from "@iac-factory/api-authentication-routing";

import { Default, Validation } from "@iac-factory/api-authentication-services";

import Router, { Endpoint, Schema, Operation } from "./definition";

Router.post( Endpoint.route, async ( request, response ) => {
    const jwt = request.body?.jwt ?? null;

    (function Body () {
        Debugger.debug(Operation, request.body);
    })();

    const data = ( jwt ) ? await Validation( jwt, request.ip ) : null;

    ( data ) && response.status( 200 ).send( data );
    ( data ) || response.status( 401 ).send();
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