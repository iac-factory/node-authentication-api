import { Debugger } from "..";

import type { Application } from "express";
import type { Request, Response, NextFunction } from "express";

/***
 * Middleware that establishes a timestamp on the Response object
 *
 * Specifically,
 *
 * > A Number representing the milliseconds elapsed since the UNIX epoch.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now `Date.now()`}
 *
 * @param {Server} server
 * @constructor
 *
 */
export const Timestamp = (server: Application) => {
    Debugger.debug("Initialization", "Adding Timestamp HTTP Middleware ...");

    /***
     *
     * @param request
     * @param response
     * @param callback
     * @constructor
     */
    async function Timer (request: Request, response: Response, callback: NextFunction) {
        /// Unix Timestamp (C-Time)
        response.locals["X-Time-Initial"] = new Date().getTime();

        response.on("close", () => {
            const initial = response.locals["X-Time-Initial"];

            const delta = (new Date().getTime() - initial) / 1000;

            (function Timestamp () {
                void Debugger.debug(request.url, "HTTP Response Duration" + ":" + " " + delta + " " + "Second(s)");
            })();
        });

        void callback();
    }

    server.use(Timer);
};

export default { Timestamp };
