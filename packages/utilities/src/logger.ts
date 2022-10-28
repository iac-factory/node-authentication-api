import ANSI from "ansi-colors";

import FS from "fs";
import Utility from "util";

type Message = string[] | (string | number | undefined)[];
export module Namespace {
    function $(site: number): Callsite {
        const _ = Error.prepareStackTrace;
        Error.prepareStackTrace = (exception, stack) => stack;
        const Interface: Function["prototype"] = Error().stack?.slice(site);
        const Stack = new Proxy(Interface, {});
        Error.prepareStackTrace = _;
        return Stack;
    }

    type Callsite = Function & [{
        getThis: () => object | string | number | symbol | undefined;
        getTypeName: () => object | string | number | symbol | null;
        getFunction: () => object | string | number | symbol | undefined;
        getFunctionName: () => string;
        getMethodName: () => object | string | number | symbol;
        getFileName: () => string;
        getLineNumber: () => number;
        getColumnNumber: () => number;
        getEvalOrigin: () => object | string | number | symbol | undefined;
        isToplevel: () => boolean;
        isEval: () => boolean;
        isNative: () => boolean;
        isConstructor: () => boolean;
    }]

    export const Context = (site: number = 4) => {
        const [namespace] = $(site);

        return {
            Callable: namespace.getFunctionName() ?? namespace.getMethodName(),
            Module: namespace.getFileName(),
            Line: namespace.getLineNumber(),
            Global: namespace.isToplevel()
        };
    };
}

const Color = ANSI.create();
const Index = Reflect.get;

/*** ... Damn Typescript Hack for Indexing Object Properties */
const Search = (target: object, ...properties: string[]) => {
    const pointer = Object.create({
        reference: null
    });

    for (const property of properties) {
        if (pointer.reference === null) {
            pointer.reference = Index(target, property);
        } else {
            if (typeof pointer.reference === "object") {
                pointer.reference = Index(pointer.reference, property);
            } else break;
        }
    }

    return pointer.reference;
};

export enum Level { "TRACE", "DEBUG", "INFORMATIONAL", "LOG", "WARNING", "ERROR" }

export enum Prefix { "Trace", "Debug", "Informational", "Log", "Warning", "Error" }

export module Enumeration {
    export type Levels = keyof typeof Level;
    export type Prefixes = keyof typeof Prefix;
}

export type Validations = { module?: any, callable?: any, file?: any, verbosity?: any };
export type Arguments = ({ file?: boolean, callable?: boolean, module?: boolean, verbosity?: boolean } | object | string | number | boolean)[];
export type Configuration = { options?: string | number | boolean | { file?: boolean | undefined; callable?: boolean | undefined; module?: boolean | undefined; verbosity?: boolean | undefined; }, defaults: { module: boolean, callable: boolean, file: boolean, verbosity: boolean } };

export module Flags {
    /*** Output the Module Filename of Logged Callsite */
    export const CALLSITES = true;
    export const VERBOSITY = true;
    export const MODULE = true;
    export const CALLABLE = true;
}

export class Logger {
    constructor(public readonly namespace: string, public readonly output: number | NodeJS.Process["stdout"]["fd"] = process.stdout.fd) {};

    private static get defaults() {
        return {
            module: Flags.MODULE,
            callable: Flags.CALLABLE,
            file: Flags.CALLSITES,
            verbosity: Flags.VERBOSITY
        };
    }

    /*** Escape Hatch Logger for Abnormal Log Event(s) + Active Development */
    write(...message: Message) {
        const content = (message.length > 1)
            ? message.join(", ") : String(message);

        FS.writeSync(this.output, " >>> " + "[" + Color.bold(Color.greenBright("Logger")) + "]" + ":" + " " + content);
    }

    /*** @see {@link settings} */
    trace(...Arguments: Arguments) {
        const prefix = "Trace";
        const settings = this.settings(prefix, Arguments);

        console.log(...settings);
    }

    /*** @see {@link settings} */
    debug(...Arguments: Arguments) {
        const prefix = "Debug";
        const settings = this.settings(prefix, Arguments);

        console.log(...settings);
    }

    /*** @see {@link settings} */
    informational(...Arguments: Arguments) {
        const prefix = "Informational";
        const settings = this.settings(prefix, Arguments);

        console.log(...settings);
    }

    /*** @see {@link settings} */
    log(...Arguments: Arguments) {
        const prefix = "Log";
        const settings = this.settings(prefix, Arguments);

        console.log(...settings);
    }

    /*** @see {@link settings} */
    warning(...Arguments: Arguments) {
        const prefix = "Warning";
        const settings = this.settings(prefix, Arguments);

        console.log(...settings);
    }

    /*** @see {@link settings} */
    error(...Arguments: Arguments) {
        const prefix = "Error";
        const settings = this.settings(prefix, Arguments);

        console.log(...settings);
    }

    /***
     * Console Output Settings
     *
     * In a perfect world, styling console output wouldn't require insane amounts of configuration + data-structures, named
     * arguments, special positionals, etc. etc. But this isn't a perfect world.
     *
     * However, the following configuration generator aims to make logging as easy as `console.log`, but with a much more
     * useful set of defaults, visual aids. See the examples section for usage.
     *
     * The following Function's logic branches are *Incredibly Difficult to Unit-Test* given, well, the non-deterministic
     * nature of checking standard-output control characters (styling)... And most importantly... because strings are
     * a primitive.
     *
     * @example
     * const Debugger = new Logger("Core");
     * Debugger.debug("Server is Online", [
     *      "http://" + process.env[ "SERVER_HOSTNAME" ]!, process.env[ "SERVER_PORT" ]!
     * ].join( ":" ) );
     *
     * >>> [Core] [Main.HTTP] [Debug] Server is Online [ 'http://0.0.0.0:3000' ]
     *
     * @example
     * const Debugger = new Logger("Core");
     * Debugger.debug({ file: true }, "Server is Online", [
     *      "http://" + process.env[ "SERVER_HOSTNAME" ]!, process.env[ "SERVER_PORT" ]!
     * ].join( ":" ) );
     *
     * >>> [Core] [Main.HTTP] [Debug] Server is Online [ 'http://0.0.0.0:3000' ]
     * >>>   ↳ file:///Users/jsanders/@Development/iac-api-next/packages/core/src/index.ts
     *
     * @example
     * const Debugger = new Logger("Core");
     * Debugger.debug({file: true });
     *
     * >>> [Core] [Main.HTTP] [Debug] 'N/A'
     * >>>   ↳ file:///Users/jsanders/@Development/iac-api-next/packages/core/src/index.ts
     *
     * @example
     * $ export CALLSITES="true"
     *
     * const Debugger = new Logger("Core");
     * Debugger.debug();
     *
     * >>> [Core] [Main.HTTP] [Debug] 'N/A'
     * >>>   ↳ file:///Users/jsanders/@Development/iac-api-next/packages/core/src/index.ts
     *
     * @example
     * const Debugger = new Logger("Core");
     * Debugger.debug();
     *
     * >>> [Core] [Main.HTTP] [Debug] 'N/A'
     *
     */
    settings(prefix: Enumeration.Prefixes, Arguments: Arguments) {
        const $ = Namespace.Context();

        const module = ($.Module) ? $.Module : false;
        const title = (typeof Arguments[0] === "string");
        const callable = ($.Callable) ? $.Callable : false;
        const verbosity = prefix;

        return [
            (this.namespace) ? "[" + Color.blue(Color.bold(this.namespace)) + "]" : null,
            (title) ? "[" + Color.green(Arguments.shift() as string) + "]" : null,
            (callable) ? "[" + Color.yellow(callable) + "]" : null,
            "[" + Color.dim(verbosity) + "]",
            Utility.inspect( { ... Arguments }, { colors: true, depth: Infinity, compact: true }),
            (module) ? "\n" + " ".repeat(2) + Color.bold(Color.magentaBright("↳")) + " " + "file://" + module : null
        ].filter(($) => $);
    }
}

export default Logger;