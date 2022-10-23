import HTTP from "http";

import API, { Router, Express } from "express";

import { OAPI, Methods, V31 } from "@iac-factory/api-authentication-schema";

export const Global: { routes: (OAPI.Path & { "x-open-api-pathing-parameter"?: string, "x-open-api-method": Lowercase<keyof typeof OAPI.Request.Methods> })[] } & { [$: string]: object | symbol } = Reflect.construct(Object, []);

Global.routes = [];

export const Schema: OAPI.Document = {
    openapi: "3.0.0",
    info: {
        "version": "0.8.0",
        "title": "IaC-Factory",
        "license": {
            "name": "BSD-3-Clause"
        }
    },
    servers: [
        {
            "url": "http" + ":" + "//" + process.env["SERVER_HOSTNAME"] + ":" + process.env["SERVER_PORT"]
        }
    ],
    paths: {},
    components: {
        schemas: {
            Default: {
                type: "object",
                title: "Default Response Schema",
                description: "...",
                properties: {
                    test: {}
                }
            },
            Error: {
                type: "object",
                required: [
                    "message"
                ],
                properties: {
                    code: {
                        type: "integer",
                        format: "int32"
                    },
                    message: {
                        type: "string"
                    }
                }
            }
        },
        securitySchemes: {
            JWT: {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    },
    security: [
        {
            JWT: []
        }
    ]
};

Reflect.set(API, "Reflection", (name: string, options?: { strict: boolean; casing: boolean; merge: boolean }) => {
    if (Global[name]) throw new Error("Global-Namespace-Clash-Exception");

    const symbol = Symbol.for(name);

    Global[name] = symbol;

    const Instance: typeof Router = Reflect.get(API, "Router");

    const instance = Instance({
        strict: options?.strict ?? false,
        caseSensitive: options?.casing ?? false,
        mergeParams: options?.merge ?? true
    });

    Reflect.set(instance, "registry", {
        symbol,
        "operational-id": name
    });
    Reflect.set(instance, "update", function <Generic = typeof Router>(this: Router & { schema: V31.PathsObject, path: string, debug?: boolean }, data?: V31.PathsObject, debug?: boolean) {
        if ((this instanceof Router) && data) {
            /*** @todo - Either Explain this Complexity or Simplify */

            /***
             * In simple cases where only a single Open-API Path Definition is passed
             * to `Router.update()`, the following operation is without value. However,
             * say the client is implementing a definition with more than a single key-value
             * path schema, or if the Router is instantiated arbitrarily, more than once,
             * there needs to be a means to ensure needless loops aren't included in the
             * overall Open-API Schema Generation.
             *
             * There's also the need of having a single Iterable type regardless of
             * the number of inputs contained in the `data` argument.
             *
             * @type {Set<{[p: string]: (Omit<{$ref?: string, summary?: string, description?: string, servers?: V3.ServerObject[], parameters?: (V3.ReferenceObject | V3.ParameterObject)[]} & {get?: V3.OperationObject<{}>, put?: V3.OperationObject<{}>, post?: V3.OperationObject<{}>, delete?: V3.OperationObject<{}>, options?: V3.OperationObject<{}>, head?: V3.OperationObject<{}>, patch?: V3.OperationObject<{}>, trace?: V3.OperationObject<{}>}, "servers" | "parameters"> & {servers?: V31.ServerObject[], parameters?: (V31.ReferenceObject | V31.ParameterObject)[]} & {get?: V31.OperationObject<{}>, put?: V31.OperationObject<{}>, post?: V31.OperationObject<{}>, delete?: V31.OperationObject<{}>, options?: V31.OperationObject<{}>, head?: V31.OperationObject<{}>, patch?: V31.OperationObject<{}>, trace?: V31.OperationObject<{}>}) | undefined}>}
             *
             */
            const unique = new Set(...[ Object.entries(data).map((entry) => {
                return {
                    [entry[0]]: entry[1]
                };
            }) ]);

            /*** The following namespace is only ever called during an API's Initialization; Optimizations for the sake of speed are without value here */

            // ( debug ) && console.debug( "[Debug] Unique Transformation(s)" + ":", Utility.inspect( unique, { colors: true, compact: false, sorted: true } ) );
            // ( debug ) && console.debug( "[Debug] Unique Iterable(s)" + ":", Utility.inspect( unique.values(), { colors: true, compact: false, sorted: true } ) );
            // ( debug ) && console.debug( "[Debug] Unique Spread" + ":", Utility.inspect( [ ... unique.values() ], { colors: true, compact: false, sorted: true } ) );

            /*** Cannot use `in` as the `Unique.values()` type is a singleton (Iterable) */
            for (const schema of [ ...unique.values() ]) {
                // console.debug( "[Debug] Unique Transformation" + ":", Utility.inspect( schema, {
                //     colors: true,
                //     compact: false,
                //     sorted: true
                // } ) );

                /*** Technically, `routes` should never be more than 1 string value per array */
                const routes = Object.keys(schema);

                const expressions = {
                    api: new RegExp("(?<path>(.*))(\\:(?<parameter>(.*)))", "gid").exec(routes[0] as string),
                    oapi: new RegExp("(?<path>(.*))(\\{(?<parameter>(.*))})", "gid").exec(routes[0] as string)
                };

                const difference = ((expressions.api) && !(expressions.oapi));

                const {
                    path,
                    parameter
                } = (expressions.api?.groups) ? expressions.api?.groups : {
                    path: null,
                    parameter: null
                };

                const route = (difference && path && parameter) ? [ path, "{" + parameter + "}" ].join("/") : routes[0] as string;

                const iterator: { count: number, mapping: { route: string, method: string, index: number, identifier: string }[], methods: string[] } = {
                    mapping: [],
                    methods: Methods(),
                    count: 0
                };

                for (const property in data[route]) {
                    if (iterator.methods.includes(property)) {
                        iterator.mapping.push({
                            index: iterator.count,
                            route: String(route),
                            method: property,
                            identifier: property.toUpperCase() + " " + String(route)
                        });

                        iterator.count++;
                    }
                }

                iterator.mapping.forEach((element) => {
                    data![element.route]![element.method as "any"]!.operationId = element.identifier;
                });

                (Schema["paths"]) && Reflect.set(Schema["paths"], route, data[route]!);
            }
        }

        return this;
    });

    const mutator = Reflect.get(instance, "update");

    const pointer = Reflect.get(Global, "routes");

    mutator() && pointer.push(instance);

    return instance;
});

export const Controller: Reflection = Reflect.get(API, "Reflection");

export const Application: Express & HTTP.Server = API() as Express & HTTP.Server;

export default Application;

export * from "./src";

type Options = { strict: boolean; casing: boolean; merge: boolean };

export type Server = typeof Application;
export type Route = API.IRouter & { documentation?: object | string };
export type Register = { registry: { symbol: Symbol, "operation-id": string }, update: (data: V31.PathsObject | object, debug?: boolean) => Router & { schema?: V31.PathsObject, readonly path: string, debug?: boolean, registry: { symbol: Symbol, "operation-id": string } } };
export type Reflection = (name: string, options?: Options) => Router & Register;
