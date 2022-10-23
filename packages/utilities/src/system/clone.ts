import Path from "path";
import Subprocess from "child_process";
import { Checkout } from ".";

/***
 * `git` Repository Clone Command
 * ---
 *
 * @param repository
 * @param branch
 * @param target
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */
export const Clone = async (repository: string, branch: string, target: string = Path.join(process.cwd(), Path.basename(repository).replace(".git", ""))): Promise<boolean> => {
    const command = () => {
        const partials = ( branch ) ? [
            "git", "clone", repository, "--branch", branch
        ] : [ "git", "clone", repository ];

        partials.push(target);

        const lexical = partials.join(" ").replace("$", "").replace("{", "").replace("}", "").replace("(", "").replace(")", "");

        return lexical.split(" ");
    };

    const executable = command();

    const awaitable = () => new Promise((resolve, reject) => {
        if ( !executable[ 0 ] ) {
            throw TypeError("`executable` Cannot be an Empty Array");
        }

        const subprocess = Subprocess.spawn(executable[ 0 ], [ ... executable.splice(1) ], {
            shell: false, env: process.env, stdio: "pipe"
        });

        subprocess.stdout?.on("data", (chunk /*** @type {Buffer<Uint8Array>} */) => {
            const buffer = chunk.toString("utf-8", 0, chunk.length);
        });

        subprocess.on("error", (error) => {
            reject(error);
        });

        subprocess.on("exit", (code, handle) => {
            ( code !== 0 ) && reject({ code, handle });
        });

        subprocess.on("close", async (code, handle) => {
            ( code !== 0 ) && reject({ code, handle });

            const $ = await Checkout(target);

            resolve($);
        });
    });

    try {
        await awaitable();

        return true;
    } catch ( exception ) {
        console.error("Exception - Error Cloning Repository", { repository, branch, target });
    }

    return false;
};

export default Clone;