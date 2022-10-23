import Path from "path";

import type { Questions } from "./prompts";

export module Environment {
    export type Input = Uppercase<string>[] | string[];

    /***
     * By providing a list of expected environment variables, `Settings` will generate
     * a list of {@link Questions} for the {@link Loader} function.
     *
     * @param {Environment.Input} input
     * @return {Questions}
     * @constructor
     */
    export function Settings (input: Input, variables: NodeJS.Process["env"]): Questions {
        const questions: Questions = [];

        for (const variable of input) {
            if (!(process.env[variable])) {
                questions.push({
                    key: variable,
                    prompt: variable
                });
            } else {
                questions.push({
                    key: variable,
                    prompt: variable,
                    value: variables[variable]
                });
            }
        }

        return questions;
    }

    /***
     * # Environment Variable Loader #
     *
     * By default, the following function loads  a `.env` file from where the `node`
     * process was executed from.
     *
     * @param {boolean} debug
     * @param {string} path
     * @return {Promise<void>}
     *
     * @constructor
     */
    export async function Loader(override: boolean = false, debug?: boolean, path?: string): Promise<void> {
        await import("dotenv/config");

        const Importer = ( await import("dotenv") ).default;

        debug ??= false;
        path ??= Path.join(process.cwd(), ".env");

        const configuration = Importer.config({
            encoding: "utf-8",
            debug: debug,
            path: path,
            override: override
        });

        process.env = { ... process.env, ... configuration.parsed };
    }
}

export default Environment;