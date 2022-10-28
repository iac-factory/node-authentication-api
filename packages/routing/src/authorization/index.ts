import { Default, Validation } from "@iac-factory/api-authentication-services";

import Router, { Endpoint, Schema } from "./definition";

Router.post( Endpoint.route, async ( request, response ) => {
    const jwt = request.body?.jwt ?? null;

    const data = ( jwt ) ? await Validation( jwt, request.ip ) : null;

    ( data ) && response.status( 200 ).send( data );
    ( data ) || response.status( 401 ).send();
} );

const Information = Default.Response();
Router.all( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export { Router };
export { Schema };

export default Router;
