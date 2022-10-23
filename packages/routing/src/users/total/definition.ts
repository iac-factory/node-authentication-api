import { Controller } from "@iac-factory/api-authentication-services";

export const Router = Controller( "IaC.Factory.API.Users.Total" );
/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/users/total" } as const;

export const X = {
    "X-Default-Response": 200
}

export default Router.update( {
    [ Endpoint.route ]: {
        summary:     "API Endpoints",
        description: "REST Responses",
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
        }, ... X,
    }
}, false );