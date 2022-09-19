import { Parse } from "./parse";

import Router, { Endpoint } from "./definition";

import { Default } from "@iac-factory/api-services";

const Information = Default.Response();

Router.get( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

Router.post( Endpoint.route, async ( request, response ) => {
    const name = request?.body?.database ?? "admin";

    const indexes = await Parse( name );

    response.status( 200 ).send( indexes );
} );

Router.get( Endpoint.parameter, async ( request, response ) => {
    const name = request?.params?.database ?? "admin";

    const indexes = await Parse( name );

    response.status( 200 ).send( indexes );
} );

export default Router;
