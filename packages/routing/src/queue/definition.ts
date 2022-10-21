import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.Queue" );
/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/queue" } as const;

export const X = {
    "X-Default-Response": 200
}

export const Schema = {
    summary:     "Polling Queue for Long-Running or Awaitable IO Event(s)",
    description: "[ ... ] Polling Queue for Long-Running or Awaitable IO Event(s)",
    post:         {
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
};

export default Router.update( {
    [ Endpoint.route ]: Schema, ... X
}, false );

