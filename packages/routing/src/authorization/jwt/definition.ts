import { Controller } from "@iac-factory/api-authentication-services";

export const X = {
    "X-Default-Response": 200,
}

export const Operation = "IaC.Factory.API.Authorization.JWT";
export const Router = Controller( Operation );
/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/authorization/jwt" } as const;

export const Schema = {
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
} as const;

export default Router.update( Schema );

