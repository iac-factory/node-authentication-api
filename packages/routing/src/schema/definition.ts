import { Controller } from "@iac-factory/api-authentication-services";

export const Router = Controller( "IaC.Factory.API.Schema.Definition" );
/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/schema/definition" } as const;

export default Router.update( {
    [ Endpoint.route ]: {
        summary:     "... Endpoints",
        description: "... REST Responses",
        get:         {
            responses: {
                "200": {
                    description: "... Description",
                    headers:     {},
                    content:     {
                        "Application/JSON": {
                            schema: { type: "object" }
                        }
                    }
                }
            }
        }
    }
} );

