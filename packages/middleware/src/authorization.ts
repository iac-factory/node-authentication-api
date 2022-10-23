import { Logger } from "@iac-factory/api-authentication-utilities";

import type { Request, Response } from "express";

import type { IncomingHttpHeaders } from "http";

import { Validation } from "@iac-factory/api-authentication-services";

import Token from "jsonwebtoken";

const Debugger = new Logger("Middleware");

/***
 *
 * @param request
 * @param response
 * @param callback
 * @constructor
 */
export async function Authorize(request: Request, response: Response, role: string) {
    const error = () => Debugger.error("Middleware", {
        request: {
            headers: request.headers,
            body: request.body
        }
    });

    const authorized = (token: string, username: string) => {
        response.locals["JWT-Authorization-Token"] = token;

        const partials = Token.decode(token, {
            complete: true,
            json: true
        });

        response.locals["JWT-Partials"] = partials;

        response.locals["JWT-User"] = username;

        if (partials) {
            const { payload: { sub: permissions }} = partials;

            if (permissions && typeof permissions === "string" && (permissions === role || permissions.toLowerCase() === role || permissions.toUpperCase() === role)) {
                response.set("Content-Type", "Application/JSON");
            } else {
                unauthorized();
            }
        }
    };

    const unauthorized = () => {
        response.locals["JWT-Authorization-Token"] = null;

        response.status(401);
        response.set("WWW-Authenticate", "Token-Exchange");

        response.send({ exception: "Invalid JWT Token" });
    };

    const headers = Object.entries(request.headers);

    const evaluation: IncomingHttpHeaders = Object.create({});
    for (const [ header, value ] of headers) {
        evaluation[header.toLowerCase()] = value;
    }

    const origin = request.ip;

    if (evaluation["authorization"]) {
        const validation = await Validation(evaluation["authorization"], origin);

        if (validation && "username" in validation) {
            Debugger.debug("Middleware", { username: validation.username });

            authorized(evaluation["authorization"], validation.username);

            return true;
        } else {
            error();

            unauthorized();

            return false;
        }
    } else {
        error();

        unauthorized();

        return false;
    }
}

export default Authorize;