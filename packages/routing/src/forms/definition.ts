import { Controller } from "@iac-factory/api-authentication-services";

/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/forms", search: "forms/:identifier" } as const;

export const Router = Controller( "IaC.Factory.API.Forms" );

export const X = {
    "X-Default-Response": 200
}

export default Router.update( {
    [ Endpoint.route ]: {
        summary:     "... Endpoints",
        description: "... REST Responses",
        "*":         {
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
        },
        post:         {
            requestBody: {
                content: {
                    "Application/JSON": {
                        schema: {
                            properties: {
                                form: {
                                    type: "object",
                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
                                            required: true
                                        },
                                        fluid: {
                                            type: "boolean",
                                            required: false
                                        },
                                        title: {
                                            type: "string",
                                            required: true
                                        }
                                    }
                                },
                                fields: {
                                    type: "array",
                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
                                            required: true
                                        },
                                        type: {
                                            type: "string",
                                            required: true
                                        },
                                        autofill: {
                                            type: "string",
                                            required: true
                                        },
                                        row: {
                                            type: "string",
                                            required: true
                                        },
                                        placeholder: {
                                            type: "string",
                                            required: false
                                        },
                                        label: {
                                            type: "string",
                                            required: false
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            },
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
        },
        put:         {
            requestBody: {
                content: {
                    "Application/JSON": {
                        schema: {
                            properties: {
                                form: {
                                    type: "object",
                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
                                            required: true
                                        }
                                    }
                                },
                                fluid: {
                                    type: "boolean",
                                    required: false
                                },
                                title: {
                                    type: "string",
                                    required: false
                                }
                            }
                        }
                    }
                }
            },
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
        },
        delete:         {
            requestBody: {
                content: {
                    "Application/JSON": {
                        schema: {
                            properties: {
                                form: {
                                    type: "object",
                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
                                            required: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
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
        },
        get:         {
            parameters: [
                {
                    in: "query",
                    name: "identifier",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "Used to Index the Form's Database"
                }
            ],
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

