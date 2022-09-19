import HTTP from "http";

import { Logger } from "@iac-factory/api-utilities";
import { Application } from "@iac-factory/api-services";

export module Socket {
    const Debugger = new Logger( "Core" );

    const Implementation = ( HTTP.createServer( Application ) );

    Reflect.set( Implementation, "count", 0 );

    /*** Get **Current Server Count** - The Following Function Needs to be Kept *Outside of `Server`'s Namespace* */
    const Count = () => {
        return Reflect.get( Implementation, "count" );
    }

    /*** **Increment Current Server Count** - The Following Function Needs to be Kept *Outside of `Server`'s Namespace* */
    const Increment = () => {
        Reflect.set( Implementation, "count", Count() + 1 );
    }

    /*** **Decrement Current Server Count** - The Following Function Needs to be Kept *Outside of `Server`'s Namespace* */
    const Decrement = () => {
        Reflect.set( Implementation, "count", Count() - 1 );
    }

    export async function Server( initialize: boolean = true ) {
        ( initialize ) && Increment();
        ( initialize ) && ( function Constructor() {
            Debugger.debug( "Server", "Initializing ..." );
        } )();

        Implementation.addListener( "kill", async () => {
            ( Count() >= 1 ) && ( function Connections() {
                Debugger.debug( "Server", "Active Server Connection(s)" + ":", Application.connections ?? 0 );
            } )();

            ( Count() >= 1 ) && ( function Destruction() {
                Debugger.debug( "Server", "Shutting Down Server ..." );
            } )();

            Decrement();

            /*** Detach the HTTP Emitter from Node's Event-Loop; Attached Emitters Statefully Keep the Process Alive */
            void Implementation.unref();

            await new Promise( async ( resolve ) => Implementation.emit( "stop", resolve ) );
        } );

        Implementation.addListener( "stop", async ( callback?: Callback ) => {
            await ( async () => new Promise( ( resolve ) => Implementation.close( resolve ) ) )();

            void Implementation.closeAllConnections();

            ( callback ) && callback();
        } );

        return Implementation;
    }

    export interface Callback {
        ( ... args: any[] ): any;

        fail( error?: string | { message: string } ): any;
    }
}

export const { Server } = Socket;

export default Server;