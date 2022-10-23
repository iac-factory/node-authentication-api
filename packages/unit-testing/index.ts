import Path from "path";

import { Logger } from "@iac-factory/api-authentication-utilities";

const Console = new Logger( "State" );

/***
 * Debugging Hook
 * ---
 *
 * Unit-Test Closure State
 *
 * @return {any | void}
 */
export const closure = (): any | void => afterEach( () => {
    const state = expect.getState() as jest.MatcherState & Record<string, object | number | string | boolean> & { data: object | string; prefix?: string };

    const target = state.testPath;

    const metadata = {
        path: target as string,
        extension: Path.extname( target as string ),
        prefix: state.prefix
    };

    if ( metadata.extension.includes( "js" ) ) {
        const replacement = metadata.path.replace( metadata.extension, ".ts" );

        Reflect.set( metadata, "path", replacement );
    }

    const link = "file://" + metadata.path + "\n";

    Console.write( ( metadata.prefix ) ? [ metadata.prefix, link ].join( " " ) : link );
} );

/***
 * Initialize
 * ---
 *
 * Update Jest Global Timeout(s)
 *
 * <br/>
 *
 * @example
 * initialize() && void closure();
 */
export const initialize = () => {
    jest.setTimeout( 10 * 1000 );

    // void closure();

    /*** Required for conditional call(s) */
    return true;
};

export module Timers {
    /***
     * Set a 5-Minute Wait Time
     */
    export function Long () {
        jest.setTimeout(1e4 * 60 * 5);

        return true;
    }
}

/*** @see {@link initialize} - Alias */
export const Initialize = initialize;

export default initialize;

export { Package } from "..";

export { Logger };