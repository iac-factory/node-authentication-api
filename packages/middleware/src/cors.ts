import { Debugger } from "..";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

module Middleware {
    var vary = require( "vary" );

    function isString( input: any ) {
        return ( typeof input === "string" ) || ( input instanceof String );
    }

    function isOriginAllowed( origin: string, allowedOrigin?: RegExp | string | string[] ) {
        if ( Array.isArray( allowedOrigin ) ) {
            for ( var i = 0; i < allowedOrigin.length; ++i ) {
                if ( isOriginAllowed( origin, allowedOrigin[ i ] ) ) {
                    return true;
                }
            }
            return false;
        } else {
            if ( isString( allowedOrigin ) ) {
                return origin === allowedOrigin;
            } else {
                if ( allowedOrigin instanceof RegExp ) {
                    return allowedOrigin.test( origin );
                } else {
                    return !!allowedOrigin;
                }
            }
        }
    }

    function configureOrigin( options: { preflightContinue?: any; optionsSuccessStatus?: any; origin?: string | RegExp | string[] | undefined; credentials?: boolean; methods?: string | string[]; allowedHeaders?: any; headers?: any; maxAge?: { toString: () => any }; exposedHeaders?: any }, req: { method?: any; headers?: { origin: any } | { [ p: string ]: any } } ) {
        const requestOrigin = req.headers?.origin;
        const headers = [];

        var isAllowed;

        if ( !options.origin || options.origin === "*" ) {
            // allow any origin
            headers.push( [ {
                key:   "Access-Control-Allow-Origin",
                value: "*"
            } ] );
        } else {
            if ( isString( options.origin ) ) {
                // fixed origin
                headers.push( [ {
                    key:   "Access-Control-Allow-Origin",
                    value: options.origin
                } ] );
                headers.push( [ {
                    key:   "Vary",
                    value: "Origin"
                } ] );
            } else {
                isAllowed = isOriginAllowed( requestOrigin, options.origin );
                // reflect origin
                headers.push( [ {
                    key:   "Access-Control-Allow-Origin",
                    value: isAllowed ? requestOrigin : false
                } ] );
                headers.push( [ {
                    key:   "Vary",
                    value: "Origin"
                } ] );
            }
        }

        return headers;
    }

    function configureMethods( options: { preflightContinue?: any; optionsSuccessStatus?: any; origin?: string | RegExp | string[] | undefined; credentials?: boolean; methods?: string | string[]; allowedHeaders?: any; headers?: any; maxAge?: { toString: () => any }; exposedHeaders?: any }, req: { method?: any; headers?: { origin: any } | { [ p: string ]: any } } ) {
        var methods = options.methods;

        if ( methods instanceof Array ) {
            if ( typeof options.methods !== "string" ) {
                // .methods is an array, so turn it into a string

                methods = ( options.methods ) ? options.methods.join( "," ) : options.methods;
            }
        }

        return {
            key:   "Access-Control-Allow-Methods",
            value: methods
        };
    }

    function configureCredentials( options: { preflightContinue?: any; optionsSuccessStatus?: any; origin?: string | RegExp | string[] | undefined; credentials?: boolean; methods?: string | string[]; allowedHeaders?: any; headers?: any; maxAge?: { toString: () => any }; exposedHeaders?: any }, req: { method?: any; headers?: { origin: any } | { [ p: string ]: any } } ) {
        if ( options.credentials ) {
            return {
                key:   "Access-Control-Allow-Credentials",
                value: "true"
            };
        }
        return null;
    }

    function configureAllowedHeaders( options: { preflightContinue?: any; optionsSuccessStatus?: any; origin?: string | RegExp | string[] | undefined; credentials?: boolean; methods?: string | string[]; allowedHeaders?: any; headers?: any; maxAge?: { toString: () => any }; exposedHeaders?: any }, req: { method?: any; headers?: { origin?: string, "access-control-request-headers"?: string } | { [ p: string ]: any } } ) {
        var allowedHeaders = options.allowedHeaders || options.headers;
        var headers = [];

        if ( !allowedHeaders ) {
            allowedHeaders = req.headers ? req.headers[ "access-control-request-headers" ] : undefined;
            headers.push( [ {
                key:   "Vary",
                value: "Access-Control-Request-Headers"
            } ] );
        } else {
            if ( allowedHeaders.join ) {
                allowedHeaders = allowedHeaders.join( "," ); // .headers is an array, so turn it into a string
            }
        }
        if ( allowedHeaders && allowedHeaders.length ) {
            headers.push( [ {
                key:   "Access-Control-Allow-Headers",
                value: allowedHeaders
            } ] );
        }

        return headers;
    }

    function configureExposedHeaders( options: { preflightContinue?: any; optionsSuccessStatus?: any; origin?: string | RegExp | string[] | undefined; credentials?: boolean; methods?: string | string[]; allowedHeaders?: any; headers?: any; maxAge?: { toString: () => any }; exposedHeaders?: any }, req: { method?: any; headers?: { origin: any } | { [ p: string ]: any } } ) {
        var headers = options.exposedHeaders;
        if ( !headers ) {
            return null;
        } else {
            if ( headers.join ) {
                headers = headers.join( "," ); // .headers is an array, so turn it into a string
            }
        }
        if ( headers && headers.length ) {
            return {
                key:   "Access-Control-Expose-Headers",
                value: headers
            };
        }
        return null;
    }

    function configureMaxAge( options: { preflightContinue?: any; optionsSuccessStatus?: any; origin?: string | RegExp | string[] | undefined; credentials?: boolean; methods?: string | string[]; allowedHeaders?: any; headers?: any; maxAge?: { toString: () => any }; exposedHeaders?: any }, req: { method?: any; headers?: { origin: any } | { [ p: string ]: any } } ) {
        var maxAge = ( typeof options.maxAge === "number" || options.maxAge ) && options.maxAge.toString();
        if ( maxAge && maxAge.length ) {
            return {
                key:   "Access-Control-Max-Age",
                value: maxAge
            };
        }
        return null;
    }

    function applyHeaders( headers: string | any[], res: { setHeader: ( arg0: any, arg1: any ) => void; } ) {
        for ( var i = 0, n = headers.length; i < n; i++ ) {
            var header = headers[ i ];
            if ( header ) {
                if ( Array.isArray( header ) ) {
                    applyHeaders( header, res );
                } else {
                    if ( header.key === "Vary" && header.value ) {
                        vary( res, header.value );
                    } else {
                        if ( header.value ) {
                            res.setHeader( header.key, header.value );
                        }
                    }
                }
            }
        }
    }

    export function cors( options: { preflightContinue?: any; optionsSuccessStatus?: any; origin?: string | RegExp | string[] | undefined; credentials?: boolean; methods?: string | string[]; allowedHeaders?: any; headers?: any; maxAge?: { toString: () => any }; exposedHeaders?: any }, req: { method?: any; headers?: { origin: any } | { [ p: string ]: any } }, res: { statusCode?: any; setHeader: any; end?: any }, next: NextFunction | undefined ) {
        var headers = [],
            method = req.method && req.method.toUpperCase && req.method.toUpperCase();

        if ( method === "OPTIONS" ) {
            // preflight
            headers.push( configureOrigin( options, req ) );
            headers.push( configureCredentials( options, req ) );
            headers.push( configureMethods( options, req ) );
            headers.push( configureAllowedHeaders( options, req ) );
            headers.push( configureMaxAge( options, req ) );
            headers.push( configureExposedHeaders( options, req ) );

            applyHeaders( headers, res );

            if ( options.preflightContinue ) {
                ( next ) && next();

            } else {
                // Safari (and potentially other browsers) need content-length 0 for 204 or they just hang waiting for a body
                res.statusCode = options.optionsSuccessStatus;
                res.setHeader( "Content-Length", "0" );
                res.end();
            }
        } else {
            // actual response
            headers.push( configureOrigin( options, req ) );
            headers.push( configureCredentials( options, req ) );
            headers.push( configureExposedHeaders( options, req ) );
            applyHeaders( headers, res );

            ( next ) && next();
        }
    }
}

export const Options = {
    origin:               "*",
    credentials:          false,
    optionsSuccessStatus: 200,
    methods: ["DELETE", "GET", "HEAD", "POST", "PUT", "OPTIONS"],
    preflightContinue:    true
};

/*** CORS Middleware Loader
 *
 * @param server {Application}
 *
 *
 * @return {Application}
 *
 * @constructor
 *
 */

export const CORS = ( server: Application ) => {
    Debugger.debug("Initialization", "Adding CORs Header(s) ...");

    server.use( ( request, response, next ) => {
        Middleware.cors( Options, request, response, next );
    } );

    return server;
};

export default CORS;
