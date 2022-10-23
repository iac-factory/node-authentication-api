/**
 * @jest-environment node
 */

import Hydrate, { Timers, Logger, Initialize } from "@iac-factory/unit-testing";

describe( "TLS Snapshot(s) & State", () => {
    Hydrate() && Initialize();

    it( "Certificates", async function State () {
        /*** Module */
        const { TLS } = await import (".");

        void await TLS.Setup();

        /*** Resolver Object that Reads from Local File System */
        const { Certificates } = TLS;

        void await TLS.Setup();

        const snapshot = JSON.stringify( Certificates, null, 4);
        const result = "Successful";

        const state: import("Unit-Testing").State = {
            ... expect.getState(), ... {
                data: { result }
            }
        };

        expect.setState( state );

        expect( snapshot ).toMatchSnapshot();
    } );
} );

describe( "TLS Module Function(s)", () => {
    Hydrate() && Initialize();

    it( "Setup", async function Setup () {
        /*** Module */
        const { TLS } = await import (".");

        const { Setup } = TLS;

        const awaitable = await Setup();

        expect(awaitable).toBeTruthy();
    } );

    it( "Clean-Up", async function Clean() {
        /*** Module */
        const { TLS } = await import (".");

        const { Clean } = TLS;

        const awaitable = await Clean();

        expect(awaitable).toBeTruthy();
    } );
} );

describe("TLS Data-Structures", function () {
    Hydrate() && Initialize() && Timers.Long();

    const logger = new Logger("TLS");

    it("Shape", async function Structures () {
        /*** Module */
        const { TLS } = await import (".");

        /*** Enumeration, Validation Source of Truth */
        const { Certificate } = TLS;

        /*** Resolver Object that Reads from Local File System */
        const { Certificates } = TLS;

        /***
         *
         * @param enumeration
         * @param resolver
         */
        const compare = (enumeration: string[], resolver: string[]): boolean => {
            for (const key of enumeration) {
                if (!(resolver.includes(key))) {
                    return false;
                }
            }

            return true;
        };

        const enumeration = Object.keys(Certificate);
        logger.debug("Enumeration", enumeration);

        const resolver = Object.keys(Certificates);
        logger.debug("Resolver", resolver);

        const valid = compare(enumeration, resolver);

        expect(valid).toBeTruthy();
    });
});
