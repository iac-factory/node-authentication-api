import Router, { X, Endpoint } from "./definition";
import { Default } from "@iac-factory/api-authentication-services";

Router.post( Endpoint.route, async ( request, response ) => {
    const { Users } = await import("@iac-factory/api-authentication-services");

    const payload = Object.create( null );

    if ( ! ( request.body )) {
        response.status( 422 ).send( {
            error:     true,
            exception: "Body-Not-Found-Exception",
            status:    422,
            message:   "Ensure to Specify Content-Type := Application/JSON, and to Validate CORS Settings"
        } );
    } else {
        if ( "id" in request.body ) {
            payload.id = String( request.body.id );
        } else if ( "identifier" in request.body ) {
            payload.id = String( request.body.identifier );
        } else {
            response.status( 422 ).send( {
                error:     true,
                exception: "User-Identifier-Not-Found-in-Body-Exception",
                status:    422,
                message:   "Please POST with `id` | `identifier` in Payload Object"
            } );
        }

        response.status( X[ "X-Default-Response" ] );

        response.send( { user: await Users.Search.ID( { identifier: payload.id } ) } );
    }
} );

const Information = Default.Response();
Router.all( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export default Router;
