import Router, { X, Endpoint } from "./definition";
import { Default } from "@iac-factory/api-authentication-services";
import { Authorize } from "@iac-factory/api-authentication-middleware";

Router.post( Endpoint.route, async ( request, response ) => {
    const authorization = await Authorize(request, response, "administrator");

    async function Data () {
        const { Users } = await import("@iac-factory/api-authentication-services");

        const payload = request.body;

        if ( !( payload ) ) throw new Error( "Payload Input including \"limit\" ?? \"skip\" Required" );

        if ( !( "total" in payload ) ) throw new Error( "Payload Argument (`total`) Not Found" );
        if ( !( "page" in payload ) ) throw new Error( "Payload Argument (`page`) Not Found" );

        response.status( X[ "X-Default-Response" ] );

        const documents = await Users.Pagination( payload.total, payload.page, payload.sort );

        response.send( { users: Sanitize( documents ) } );
    }

    (authorization) && await Data();
} );

const Information = Default.Response();
Router.all( Endpoint.route, async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

const Sanitize = ( input: any[] ) => {
    return input.map( ( item ) => {
        delete item._id;
        delete item.password;

        return item;
    } );
};

export default Router;