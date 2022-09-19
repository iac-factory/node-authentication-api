import Awaitable from "async_hooks";

import { Logger } from "@iac-factory/api-utilities";

type Message = ( string | number | undefined )[];
export interface Callback extends Awaitable.HookCallbacks {
    indentation: 0 | number;
    logger: Logger,

    eid: () => number;
    log: ( partial: "Before" | "After" | "Initialization" | "Destructor", ... message: Message ) => void;
    initialize: () => Awaitable.AsyncHook | null;
    get indent(): string;
    get stdout(): NodeJS.Process["stdout"]["fd"];
    get spacing(): number;
    set spacing( indentation: number );
    get debug(): boolean;
}

/*** Object Literal w/Computed Properties + Awaitable Composition */
export const Debugger: Callback = {
    indentation: 0,
    logger:      new Logger( "IO-Debugger" ),
    eid:         () => Awaitable.executionAsyncId(),
    log:         function ( partial, ... message ) {
        const content = ( message.length > 1 ) ? message.join( ", " ) : message;
        const prefix = () => {
            switch ( partial ) {
                case "Before":
                    return "Mutex (Lock)";
                case "After":
                    return "Mutex (Unlock)";
                case "Destructor":
                    return "Destructor";
                case "Initialization":
                    return "Constructor";
            }
        }

        this.logger.write( this.indent + prefix() + ":" + " " + content + "\n" );
    },

    initialize() {
        const instance = ( Debugger.debug )
            ? new Proxy( Awaitable.createHook( Debugger ), {} )
            : null;

        if ( instance && this.debug ) {
            instance.enable();
        }

        return instance;
    },

    before( identifier ) {
        Debugger.log( "Before", identifier );
        Debugger.spacing += 4;
    },

    init( identifier, type, trigger ) {

        Debugger.log( "Initialization", identifier,
            "EID" + ":" + " " + Debugger.eid(),
            "Type" + ":" + " " + type,
            "Trigger-ID" + ":" + " " + trigger
        );
    },

    after( identifier ) {
        Debugger.spacing -= 4;
        Debugger.log( "After", identifier );
    },

    destroy( identifier ) {
        Debugger.log( "Destructor", identifier );
    },

    get debug() {
        return process.argv.includes( "--debug" ) && process.argv.includes( "--runtime" );
    },

    get indent() {
        if ( this.indentation === 0 ) {
            return "";
        } else {
            return " ".repeat( Number( this.indentation ) )
        }
    },

    get stdout() {
        return process.stdout.fd;
    },

    get spacing() {
        return this.indentation;
    },

    set spacing( indentation: number ) {
        this.indentation = indentation;
    }
}

export const Debug = () => Debugger.initialize();

export default Debugger;