import { Endpoint, Router } from "./definition";

import { Default } from "@iac-factory/api-authentication-services";

const Information = Default.Response();

Router.get( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export default Router;
