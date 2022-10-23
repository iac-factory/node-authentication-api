import { Controller } from "@iac-factory/api-authentication-services";

export const Router = Controller( "IaC.Factory.API.Utility.Document-DB.Indexes" );
/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = {
    route:     "/utility/document-db/indexes",
    parameter: "/utility/document-db/indexes/:database"
} as const;

const Model = {
    schema: {
        type:       "object",
        properties: {
            v:       {
                type: "number"
            },
            key:     {
                type: "object"
            },
            name:    {
                type: "string"
            },
            weights: {
                type: "object"
            }
        }
    }
};

const Description = "...";

Router.update( {
    [ Endpoint.parameter ]: {
        summary:     "...",
        description: Description,
        post:        {
            responses: {
                "200": {
                    description: Description,
                    headers:     {},
                    content:     {
                        "Application/JSON": Model
                    }
                }
            }
        }
    },
    [ Endpoint.route ]:     {
        summary:     "...",
        description: Description,
        get:         {
            responses: {
                "200": {
                    description: Description,
                    headers:     {},
                    content:     {
                        "Application/JSON": Model
                    }
                }
            }
        },
        post:        {
            responses: {
                "200": {
                    description: Description,
                    headers:     {},
                    content:     {
                        "Application/JSON": Model
                    }
                }
            }
        }
    }
} );

export default Router;
