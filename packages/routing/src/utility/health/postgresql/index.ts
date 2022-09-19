import Router, { Endpoint } from "./definition";

Router.get( Endpoint.route, async ( request, response ) => {
    const { PG } = await import("@iac-factory/api-database");

    const health: Response = ( await PG.Health() )
        ? "Online" : "Offline";

    response.status( 200 ).send( {
        status: health
    } );
} );

export type Response = "Online" | "Offline";

export default Router;
