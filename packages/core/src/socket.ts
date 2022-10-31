import HTTP from "http";

import { Logger } from "@iac-factory/api-authentication-utilities";
import { Application } from "@iac-factory/api-authentication-services";

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

        ( initialize ) && Implementation.addListener( "kill", async () => {
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

        ( initialize ) && Implementation.addListener( "stop", async ( callback?: Callback ) => {
            Debugger.debug( "Server", "Stopping Server ...");

            return new Promise( ( resolve, reject ) => {
                void Implementation.closeIdleConnections();
                void Implementation.closeAllConnections();
                void Implementation.close();

                /*** Detach the HTTP Emitter from Node's Event-Loop; Attached Emitters Statefully Keep the Process Alive */
                void Implementation.unref();

                void Implementation.removeAllListeners();

                resolve(void null);
            } );
        } );

        return Implementation;
    }

    export interface Callback {
        ( ... args: any[] ): any;

        fail( error?: string | { message: string } ): any;
    }
}

export const Server = Socket.Server;

export default Server;