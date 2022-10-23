import { Controller } from "@iac-factory/api-authentication-services";

export const Router = Controller( "IaC.Factory.API.Users.Paginate.Metadata" );
/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/users/pagination/metadata" } as const;

export const X = {
    "X-Default-Response": 200
}

export default Router.update( {
    [ Endpoint.route ]: {
        summary:     "API Endpoints",
        description: "REST Responses",
        post:        {
            responses: {
                "200": {
                    description: "... Description",
                    headers:     {},
                    content:     {
                        "Application/JSON": {
                            schema: {
                                type:    "object",
                                // properties: {
                                //     pages: {
                                //         type: "number"
                                //     }
                                // },
                                example: {
                                    "rows": 10,
                                    "current": 1,
                                    "next": 2,
                                    "previous": 0,
                                    "last": 100001,
                                    "payload": {
                                        "current": [
                                            10,
                                            1
                                        ],
                                        "next": [
                                            10,
                                            2
                                        ],
                                        "last": [
                                            10,
                                            100001
                                        ]
                                    },
                                    "iterator": [
                                        1,
                                        2,
                                        3,
                                        4,
                                        100001
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }, ... X,
    }
}, false );