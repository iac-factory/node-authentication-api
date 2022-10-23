/**
 * @jest-environment node
 */

import Hydrate, { Timers } from "@iac-factory/unit-testing";

import { Logger } from "@iac-factory/api-authentication-utilities";

import { Users } from "./users";

const Debugger = new Logger( "Service" );

describe( "Users Collection", function () {
    Hydrate();

    it( "Returns the Total Users(s)", async function () {
        async function Total() {
            const total = await Users.Total();

            Debugger.debug( "Total User Document(s)", total );

            expect( total ).toBeTruthy();
        }

        await Total();
    } );
} );

describe( "Users Collection Statistics", function () {
    Hydrate();

    it( "Returns the Users(s) Collection, Statistics", async function () {
        async function Statistics() {
            const statistics = await Users.Statistics();

            Debugger.debug( "User Collection Statistics", statistics );

            expect( statistics ).toBeTruthy();
        }

        await Statistics();
    } );
} );

describe( "Users Collection Indexes", function () {
    Hydrate();

    it( "Returns the Users(s) Collection, Indexes", async function () {
        async function Statistics() {
            const indexes = await Users.Indexes();

            Debugger.debug( "User Collection Indexes", indexes );

            expect( indexes ).toBeTruthy();
        }

        await Statistics();
    } );
} );

describe( "Users Collection Document(s)", function () {
    Hydrate();

    it( "Returns the Users(s) Collection, Document(s)", async function () {
        async function Documents() {
            const users = await Users.Documents( true );

            Debugger.debug( "User Collection Document(s)", users );

            const container = new ( class extends Array {
                index: number = 0;

                constructor() {
                    super();
                }
            } )();

            for await ( const user of users ) {
                Debugger.debug( "User Stream Index", container.index, user );

                container.index++;
                if ( container.index >= 10 ) {
                    break;
                }
            }

            expect( users ).toBeTruthy();
        }

        await Documents();
    } );
} );

describe( "Users Collection Document Paginator", function () {
    Hydrate();

    Timers.Long();

    it( "Returns the Users(s) Collection, Document Paginator", async function () {
        async function Documents() {
            let users = await Users.Pagination( 10, 0 );

            Debugger.debug( "User Collection Document Paginator", users );

            const container = new ( class extends Object {
                limit: number = 10;
                page: number = 0;

                constructor() {
                    super();
                }
            } )();

            do {
                const array = users;

                Debugger.debug( "Pagination", container.page, array );
                container.page++;
                users = await Users.Pagination( container.limit, container.page );

                expect( array.length ).toBe( 10 );
            } while ( container.page < 10 );

            expect( users ).toBeTruthy();
        }

        await Documents();
    } );
} );

describe( "Users Search Module", function () {
    Hydrate();

    it( "Users.Search.ID returns User", async function () {
        async function ID() {
            const user = await Users.Search.ID( { identifier: "f8a34fdc-0001-4619-91de-cc6c207fbd4d" } );

            Debugger.debug( "Users.Search.ID f8a34fdc-0001-4619-91de-cc6c207fbd4d", (user as any) );

            expect( user?.id ).toBeTruthy();
        }

        await ID();
    } );
} );

afterAll( async () => {
    await ( await Users.Instance() ).close();
} )