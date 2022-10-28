import { Debugger } from "..";

import type { Request, Response } from "express";

import type { IncomingHttpHeaders } from "http";

import { Validation } from "@iac-factory/api-authentication-services";

import Token from "jsonwebtoken";

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

    const Authorization = (token: string, username: string) => {
        response.locals["JWT-Authorization-Token"] = token;

        const partials = Token.verify(token, process.env["SECRET"]!, {
            complete: true
        });

        response.locals["JWT-Partials"] = partials;

        response.locals["JWT-User"] = username;

        Debugger.debug("JWT-Partials", partials);

        if (partials) {
            const { payload: { sub: permissions }} = partials;

            if (permissions && typeof permissions === "string" && (permissions === role || permissions.toLowerCase() === role || permissions.toUpperCase() === role)) {
                response.set("Content-Type", "Application/JSON");
            } else {
                Deauthorization();
            }
        }
    };

    const Deauthorization = () => {
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
            Debugger.debug("Validation", { username: validation.username });

            Authorization(evaluation["authorization"], validation.username);

            return true;
        } else {
            error();

            Deauthorization();

            return false;
        }
    } else {
        error();

        Deauthorization();

        return false;
    }
}

export default Authorize;