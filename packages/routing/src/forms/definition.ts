import { Controller } from "@iac-factory/api-authentication-services";

import { Extractor } from "@iac-factory/api-authentication-schema";

/*** Endpoint must be an Indexable Object in Order for the `route` Attribute to Resolve Types */
export const Endpoint = { route: "/forms" } as const;

export const Router = Controller( "IaC.Factory.API.Forms" );

export const X = {
    "X-Default-Response": 200,
}

export module Body {
    export module Post {
        type Method = "post";
        type Route = typeof Endpoint.route;

        type Properties = typeof Schema[Route][Method]["requestBody"]["content"]["Application/JSON"]["schema"]["properties"];

        export type Input = {
            [$ in keyof Properties]: Partial<Properties[$]["type"] extends "array" ? Extractor<Properties[$]>[] : Extractor<Properties[$]>>;
        }
    }

    export module Put {
        type Method = "put";
        type Route = typeof Endpoint.route;

        type Properties = typeof Schema[Route][Method]["requestBody"]["content"]["Application/JSON"]["schema"]["properties"];

        export type Input = {
            [$ in keyof Properties]: Partial<Properties[$]["type"] extends "array" ? Extractor<Properties[$]>[] : Extractor<Properties[$]>>;
        }
    }

    export module Get {
        export type Input = Partial<{
            form: string;
        }>
    }

    export module Delete {
        type Method = "delete";
        type Route = typeof Endpoint.route;

        type Properties = typeof Schema[Route][Method]["requestBody"]["content"]["Application/JSON"]["schema"]["properties"];

        export type Input = {
            [$ in keyof Properties]: Partial<Properties[$]["type"] extends "array" ? Extractor<Properties[$]>[] : Extractor<Properties[$]>>;
        }
    }
}

export const Schema = {
    [ Endpoint.route ]: {
        summary: "... Endpoints",
        description: "... REST Responses",
        post: {
            requestBody: {
                content: {
                    "Application/JSON": {
                        schema: {
                            properties: {
                                form: {
                                    type: "object",
//                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
//                                            required: true
                                        },
                                        fluid: {
                                            type: "boolean",
//                                            required: false
                                        },
                                        title: {
                                            type: "string",
//                                            required: true
                                        },
                                    },
                                },
                                fields: {
                                    type: "array",
                                    minimum: 1,
//                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
//                                            required: true
                                        },
                                        type: {
                                            type: "string",
//                                            required: true
                                        },
                                        autofill: {
                                            type: "string",
//                                            required: true
                                        },
                                        row: {
                                            type: "number",
//                                            required: true
                                        },
                                        placeholder: {
                                            type: "string",
//                                            required: false
                                        },
                                        label: {
                                            type: "string",
//                                            required: false
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: {
                        "Application/JSON": {
                            schema: { type: "object" },
                        },
                    },
                },
            },
        },
        put: {
            requestBody: {
                content: {
                    "Application/JSON": {
                        schema: {
                            properties: {
                                form: {
                                    type: "object",
//                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
//                                            required: true
                                        },
                                    },
                                },
                                fluid: {
                                    type: "boolean",
//                                    required: false
                                },
                                title: {
                                    type: "string",
//                                    required: false
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: {
                        "Application/JSON": {
                            schema: { type: "object" },
                        },
                    },
                },
            },
        },
        delete: {
            requestBody: {
                content: {
                    "Application/JSON": {
                        schema: {
                            properties: {
                                form: {
                                    type: "object",
//                                    required: true,
                                    properties: {
                                        identifier: {
                                            type: "string",
//                                            required: true
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: {
                        "Application/JSON": {
                            schema: { type: "object" },
                        },
                    },
                },
            },
        },
        get: {
            parameters: [
                {
                    in: "query",
                    name: "identifier",
//                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "Used to Index the Form's Database",
                },
            ],
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: {
                        "Application/JSON": {
                            schema: { type: "object" },
                        },
                    },
                },
            },
        },
    },
} as const;

export default Router.update( Schema );

