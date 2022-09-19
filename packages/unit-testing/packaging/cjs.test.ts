import { initialize } from ".";

describe( "CJS", () => {
    initialize();

    it( "Import", async () => {
        expect.assertions(1);

        const main = await import("..");

        /*** `package.json` is much too volatile to track statefully */
        const partial = { ... main, ... { Package: "[Redacted]" } };

        const snapshot = JSON.stringify( partial, null, 4);
        const result = "Successful";

        const state: import("Unit-Testing").State = {
            ... expect.getState(), ... {
                data: { result, snapshot }
            }
        };

        expect.setState( state );
        expect(snapshot).toMatchSnapshot();
    } );
} );
