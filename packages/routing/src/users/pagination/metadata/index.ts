import Router, { X, Endpoint } from "./definition";
import { Default } from "@iac-factory/api-services";

Router.post( Endpoint.route, async ( request, response ) => {
    const { Users } = await import("@iac-factory/api-services");

    const payload: { total: number, page: number } = request.body;

    try {
        ( !( payload ) ) && Exception("Payload-Input-Exception", "POST Body Input Required");
        ( !( "total" in payload ) ) && Exception("Payload-Input-Argument-Exception", "Payload Input Argument (`total`) Not Found");

        response.status( X[ "X-Default-Response" ] );

        const pages = await Users.Page( payload.total, payload.page );

        response.send( { ... pages } );
    } catch ( exception ) {
        response.status(422).send(JSON.stringify(exception, null, 4));
    }
} );

const Information = Default.Response();
Router.all( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export default Router;

const Exception = (type: "Payload-Input-Exception" | "Payload-Input-Argument-Exception", message: string) => {
    const error = new Error();

    error.name = type;
    error.message = message;

    Reflect.set(error, "exception", true);

    console.trace(JSON.stringify(error, null, 4));

    throw error;
}
