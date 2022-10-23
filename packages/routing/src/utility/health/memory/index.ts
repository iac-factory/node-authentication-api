import Router, { Endpoint } from "./definition";

import { Digital } from "@iac-factory/api-authentication-schema";

Router.get( Endpoint.route, async ( request, response ) => {
    const { ram } = Digital;

    const statistics = ram();

    response.status( 200 ).send( statistics );
} );

export default Router;
