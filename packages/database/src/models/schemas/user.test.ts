/**
 * @jest-environment node
 */

import Hydrate, { Timers, Logger, Initialize } from "@iac-factory/unit-testing";

describe( "User Snapshot Structure State", () => {
    Initialize();

    const Debugger = new Logger("User");

    it( "User Generator", async function State () {
        /*** Module */
        const { User } = await import (".");

        const { Generator } = User;

        const structure = Generator();

        const types = Object.create({});

        if (structure) for (const attribute of Object.keys(structure)) {
            const value = structure?.[attribute as import(".").User.Keys];

            if (value) {
                types[attribute] = typeof value;
            }
        }

        const snapshot = JSON.stringify( types, null, 4);
        const result = "Successful";

        const state = {
            ... expect.getState(), ... {
                data: { result }
            }
        } as const;

        Debugger.debug("Generator", { state });

        expect.setState( state );

        expect( snapshot ).toMatchSnapshot();
    } );
} );

describe( "User Structure Non-Falsy Validation", () => {
    Initialize();

    const Debugger = new Logger("User")

    it( "User Generator", async function Truthy () {
        /*** Module */
        const { User } = await import (".");

        const { Generator } = User;

        const structure = Generator();

        Debugger.debug("Generator", "Validation", { structure });

        expect( structure ).toBeTruthy();
    } );
} );

describe( "User Structure Null Validation", () => {
    Initialize();

    const Debugger = new Logger("User");

    it( "User Generator", async function Null () {
        /*** Module */
        const { User } = await import (".");

        const { Generator } = User;
        const { Validator } = User;

        const structure = Generator();

        delete (structure as any)["id"];

        const validation = Validator(structure);

        Debugger.debug("Generator", "Validation", { validation });

        expect( validation ).toBeFalsy();
    } );
} );