import Router, { X, Endpoint } from "./definition";
import { Default } from "@iac-factory/api-authentication-services";

Router.get( Endpoint.route, async ( request, response ) => {
    const { Users } = await import("@iac-factory/api-authentication-services");

    response.status( X[ "X-Default-Response" ] );

    response.send( { statistics: await Users.Statistics() } );
} );

const Information = Default.Response();
Router.all( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export default Router;
