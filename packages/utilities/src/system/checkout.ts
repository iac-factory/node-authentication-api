import Path from "path";
import Subprocess from "child_process";

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
export const Checkout = ( directory: string ): Promise<boolean> => {
    return new Promise((resolve) => {
        Subprocess.exec("git for-each-ref --count=1 --sort=-committerdate refs/remotes/ --format='%(refname:short)'", {
            cwd: directory, env: process.env
        }, (stderr, stdout, stdin) => {
            const branch = stdout.replace( "origin/", "" );

            Subprocess.exec( [ "git checkout", branch ].join( " " ), {
                cwd: directory, env: process.env
            }, async ( stderr, stdout, stdin ) => {
                /// console.log( stdout, /* stdin */ );

                resolve(true);
            } );
        });
    })
};

export default Checkout;