import "dotenv/config";

import Dot from "dotenv";
import Expansion from "dotenv-expand";

export const Hydrate = () => {
    Expansion.expand( Dot.config() ).parsed;

    return true;
};

export const Runtime = async () => {
    Hydrate();

    const { Initialize } = await import("@iac-factory/api-authentication-core");

    /*** Inline Type `settings` for HTTP-Listen Event Listener */
    const HTTP: [ number, string, number ] = [
        parseInt(process.env["SERVER_PORT"] ?? "3000"),
        process.env["SERVER_HOSTNAME"] ?? "0.0.0.0",
        parseInt( process.env[ "SERVER_BACKLOG" ] ?? "512" )
    ];

    if (process.env["NODE_ENV"] !== "testing") {
        const server = await Initialize();

        server.listen(...HTTP);
    }
};

export default Runtime;
