import { Debugger } from "..";
/***
 * Node.JS `crypto` Validation
 * ---
 *
 * @returns {Promise<void>}
 * @constructor
 */
export const Cryptography = async () => {
    try {
        await import("crypto");
    } catch ( error ) {
        const write: Promise<boolean> = new Promise( ( callback ) => {
            process.stderr.write(
                JSON.stringify( {
                    exception: "Crypto Support is Disabled",
                    error
                }, null, 4 ), () => callback( true )
            );

            process.exitCode = 1;
        } );

        ( await write ) && process.exit();
    }
};

export default Cryptography;
