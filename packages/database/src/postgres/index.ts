export * from "./module";

void ( async () => {
    const debug = ( process.argv.includes( "--debug" ) && process.argv.includes( "--pg" ) );

    const test = async () => {
        const { PG } = await import(".");

        await PG.Version();
    };

    ( debug ) && await test();
} )();
