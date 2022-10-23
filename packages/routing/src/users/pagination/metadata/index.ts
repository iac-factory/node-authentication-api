import Router, { X, Endpoint } from "./definition";
import { Default } from "@iac-factory/api-authentication-services";

import { Authorize } from "@iac-factory/api-authentication-middleware";

import type { Request } from "@iac-factory/api-authentication-services";
import type { Response } from "@iac-factory/api-authentication-services";

Router.post( Endpoint.route, async ( request, response, callback ) => {
    const authorization = await Authorize(request, response, "ADMINISTRATOR");

    async function Data (request: Request, response: Response) {
        const { Users } = await import("@iac-factory/api-authentication-services");

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
    }

    (authorization) && await Data(request, response);
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
