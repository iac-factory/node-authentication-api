export module OAPI {
    export type Modify<T, R> = Omit<T, keyof R> & R;

    export interface General<T extends {} = {}> {
        openapi: string;
        info: Informational;
        servers?: Server[];
        paths: Paths<T>;
        jsonSchemaDialect?: string;
        components?: Components;
        security?: {
            JWT: []
        }[];
        tags?: Tag[];
        externalDocs?: Documentation.External;
    }

    export type Document<T extends {} = {}> = Modify<Omit<General<T>, "paths" | "components">,
        {
            info: Informational;
            jsonSchemaDialect?: string;
            servers?: Server[];
        } & ( ( Pick<Webhook<T>, "paths"> & Omit<Partial<Webhook<T>>, "paths"> ) | ( Pick<Webhook<T>, "webhooks"> & Omit<Partial<Webhook<T>>, "webhooks"> ) | ( Pick<Webhook<T>, "components"> & Omit<Partial<Webhook<T>>, "components"> ) )>;

    export type Informational = Modify<{
        title: string;
        description?: string;
        termsOfService?: string;
        contact?: Contact;
        license?: License;
        version: string;
    }, { summary?: string; license?: License; }>;

    export type Contact = {
        name?: string;
        url?: string;
        email?: string;
    }

    export type License = Modify<{
        name: string;
        url?: string;
    }, { identifier?: string }>;

    export type Variable = {
        enum?: string[];
        default: string;
        description?: string;
    }

    export type Pointer = {
        $ref: string;
    }

    export type Reference = Modify<Pointer, { summary?: string; description?: string; }>;

    export interface Discriminator {
        propertyName: string;
        mapping?: { [ value: string ]: string };
    }

    export type Operational<T extends {} = {}> = {
                                                     tags?: string[];
                                                     summary?: string;
                                                     description?: string;
                                                     externalDocs?: Documentation.External;
                                                     operationId: string;
                                                     parameters?: ( Reference | Parameter )[];
                                                     requestBody?: Reference | Request.Body;
                                                     responses: Response;
                                                     callbacks?: { [ callback: string ]: Reference | Callback };
                                                     deprecated?: boolean;
                                                     security?: Schema.Security.Model[];
                                                     servers?: Server[];
                                                 } & T;

    export type Path<T extends {} = {}> = {
                                              $ref?: string;
                                              summary?: string;
                                              description?: string;
                                              servers?: Server[];
                                              parameters?: ( Reference | Parameter )[];
                                          } & {
                                              [method in Request.Methods]?: Operational<T>;
                                          };

    export type Attributes = keyof Path;

    export type Paths<T extends {} = {}, P extends {} = {}> = Record<string, ( Path<T> & P ) | undefined>;

    export module Documentation {
        export interface Example {
            schema?: Reference | Schema.Base;
            example?: any;
            examples?: { [ media: string ]: Reference | Documentation.Example };
            encoding?: { [ media: string ]: Encoding };
        }
        export interface External {
            description?: string;
            url: string;
        }
    }

    export type Webhook<T> = {
        paths: Paths<{}>;
        webhooks: Record<string, Path | Reference>;
        components: Components;
    };

    export interface Parameter {
        name: string;
        /***
         * - `path` parameters, such as /users/{id}
         * - `query` parameters, such as /users?role=admin
         * - `header` parameters, such as X-MyHeader: Value
         * - `cookie` parameters, which are passed in the Cookie header, such as Cookie: debug=0; csrftoken=BUSe35dohU3O1MZvDCU
         */
        in: "path" | "query" | "header" | "cookie";
        description?: string;
        required?: boolean;
        deprecated?: boolean;
        allowEmptyValue?: boolean;
        style?: string;
        explode?: boolean;
        allowReserved?: boolean;
        schema?: Reference | Schema.Base;
        example?: any;
        examples?: { [ media: string ]: Reference | Documentation.Example };
        content?: { [ media: string ]: Media };
    }

    export type Header = {
        description?: string;
        required?: boolean;
        deprecated?: boolean;
        allowEmptyValue?: boolean;
        style?: string;
        explode?: boolean;
        allowReserved?: boolean;
        schema?: Reference | Schema.Base;
        example?: any;
        examples?: { [ media: string ]: Reference | Documentation.Example };
        content?: { [ media: string ]: Media };
    }

    export module Request {
        export enum Methods {
            ANY = "any",
            GET = "get",
            PUT = "put",
            POST = "post",
            DELETE = "delete",
            OPTIONS = "options",
            HEAD = "head",
            PATCH = "patch",
            TRACE = "trace",
            COPY = "copy",
            LOCK = "lock",
            MKCOL = "mkcol",
            MOVE = "move",
            PURGE = "purge",
            PROPFIND = "propfind",
            PROPPATCH = "proppatch",
            UNLOCK = "unlock",
            REPORT = "report",
            MKACTIVITY = "mkactivity",
            MERGE = "merge",
            NOTIFY = "notify",
            SUBSCRIBE = "subscribe",
            UNSUBSCRIBE = "unsubscribe",
            SEARCH = "search",
            CONNECT = "connect"
        }

        export type Body = {
            description?: string;
            content: { [ media: string ]: Media };
            required?: boolean;
        }
    }

    export type Callback = Record<string, Reference | Record<string, Path | Reference>>;

    export type Server = {
        url: string;
        description?: string;
        variables?: { [ variable: string ]: Variable };
    }

    export type Encoding = {
        contentType?: string;
        headers?: { [ header: string ]: Reference | Header };
        style?: string;
        explode?: boolean;
        allowReserved?: boolean;
    }

    export type Media = {
        schema?: Reference | Schema.Base;
        example?: any;
        examples?: { [ media: string ]: Reference | Documentation.Example };
        encoding?: { [ media: string ]: Encoding };
    }

    export module Link {
        export type Object = {
            operationRef?: string;
            operationId?: string;
            parameters?: { [ parameter: string ]: any };
            requestBody?: any;
            description?: string;
            server?: Server;
        }
    }

    export type Response = {
                               description: string;
                               headers?: { [ header: string ]: Header };
                               content?: { [ media: string ]: Media };
                               links?: { [ link: string ]: Reference | Link.Object };
                           } | Reference;

    export interface Components {
        schemas?: { [ key: string ]: Reference | Schema.Base };
        responses?: { [ key: string ]: Reference | Response };
        parameters?: { [ key: string ]: Reference | Parameter };
        examples?: { [ key: string ]: Reference | Documentation.Example };
        requestBodies?: { [ key: string ]: Reference | Request.Body };
        headers?: { [ key: string ]: Reference | Header };
        securitySchemes?: { [ key: string ]: Reference | Schema.Security.Model };
        links?: { [ key: string ]: Reference | Link.Object };
        callbacks?: { [ key: string ]: Reference | Callback };
    }

    export interface Tag {
        name: string;
        description?: string;
        externalDocs?: Documentation.External;
    }

    export module Schema {
        export interface Base {
            title?: string;
            description?: string;
            format?: string;
            default?: any;
            multipleOf?: number;
            maximum?: number;
            exclusiveMaximum?: boolean;
            minimum?: number;
            exclusiveMinimum?: boolean;
            maxLength?: number;
            minLength?: number;
            pattern?: string;
            maxItems?: number;
            minItems?: number;
            uniqueItems?: boolean;
            maxProperties?: number;
            minProperties?: number;
            type?: "string" | "number" | "object" | "bigint" | "float" | "array" | string;
            /*** If Specified in a Schema, Model Context, Ensure At Least One Value Exists */
            required?: [ string ] & string[];
            enum?: any[];
            properties?: {
                             type?: "string" | "number" | "object" | "bigint" | "float" | "array" | string;
                         } & {
                             [ name: string ]: Reference | Schema.Base;
                         }
            allOf?: ( Reference | Schema.Base )[];
            oneOf?: ( Reference | Schema.Base )[];
            anyOf?: ( Reference | Schema.Base )[];
            not?: Reference | Schema.Base;

            // OpenAPI-specific properties
            nullable?: boolean;
            discriminator?: Discriminator;
            readOnly?: boolean;
            writeOnly?: boolean;
            externalDocs?: Documentation.External;
            example?: any;
            deprecated?: boolean;
        }

        export module Security {
            export enum Key {
                "JWT" = "JWT",
                "OID" = "OID",
                "Basic" = "Basic",
                "OAuth" = "OAuth"
            }

            export type Mapping = { -readonly [$ in keyof Schema.Security.Models]-?: Schema.Security.Models[$] }

            export type Requirements = {
                [Name in keyof ( Schema.Security.Models | typeof Security.Key )]-?: [];
            }

            export interface Basic {
                readonly type: "http";
                description?: string;
                scheme: string;
                bearerFormat?: string;
            }

            export interface OID {
                readonly type: "openIdConnect";
                description?: string;
                openIdConnectUrl: string;
            }

            /*** Private Access Token, API Security Token */
            export interface PAT {
                readonly type: "apiKey";
                description?: string;
                name: "JWT" | string;
                in: string;
            }

            /*** Private Access Token, API Security Token (Alias) */
            export interface API extends PAT {
            }

            export interface OAuth {
                readonly type: "oauth2";
                description?: string;
                flows: {
                    implicit?: {
                        authorizationUrl: string;
                        refreshUrl?: string;
                        scopes: { [ scope: string ]: string };
                    };
                    password?: {
                        tokenUrl: string;
                        refreshUrl?: string;
                        scopes: { [ scope: string ]: string };
                    };
                    clientCredentials?: {
                        tokenUrl: string;
                        refreshUrl?: string;
                        scopes: { [ scope: string ]: string };
                    };
                    authorizationCode?: {
                        authorizationUrl: string;
                        tokenUrl: string;
                        refreshUrl?: string;
                        scopes: { [ scope: string ]: string };
                    };
                };
            }

            export type Model = Security.API | Security.Basic | Security.OAuth | Security.OID;
            export type Models = {
                API: Security.API,
                Basic: Security.Basic,
                OAuth: Security.OAuth,
                OID: Security.OID
            }
        }
    }
}