import { Controller, Default } from "@iac-factory/api-services";
import { Endpoint } from "./definition";

const Information = Default.Response();

export const Router = Controller( "IaC.Factory.API.Schema" );
Router.get( "/schema", async ( request, response ) => {
    Information.evaluate( Endpoint.route, response );
} );

export default Router;
