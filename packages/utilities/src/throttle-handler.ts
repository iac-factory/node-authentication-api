export module Handler {
    export const evaluate = async ( callable: () => Promise<void>, state: { errors: ( object | string )[] } ) => {
            try {
                await callable();
            } catch ( error ) {
                state.errors.push( JSON.stringify( error, null, 4 ) );

                const total = state.errors.length;

                switch ( true ) {
                    case ( total === 1 ): {
                        await wait( 250 );

                        break;
                    }

                    case ( total === 2 ): {
                        await wait( 500 );

                        break;
                    }

                    case ( total === 3 ): {
                        await wait( 1000 );

                        break;
                    }

                    case ( total === 4 ): {
                        await wait( 2000 );

                        break;
                    }

                    case ( total === 5 ): {
                        await wait( 5000 );

                        break;
                    }

                    case ( total < 10 ): {
                        await wait( 15000 );

                        break;
                    }

                    default: {
                        console.error( "[Fatal]", state.errors );

                        throw error;
                    }
                }
            }
        };

    async function wait( duration: number ): Promise<void> {
        // logger().debug("Waiter Activated" + " " + "(" + duration + ")")

        void new Promise( ( resolve ) => {
            setTimeout( resolve, duration );
        } );
    }
}

export default Handler;
