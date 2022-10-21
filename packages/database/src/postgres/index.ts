export * from "./module";
export * from "..";

import { Logger } from "@iac-factory/api-utilities";

void (async () => {
    const { PG } = await import(".");

    const Debugger = new Logger("PostgreSQL");

    const version = await PG.Version();

    function Version () {
        (process.env?.["NODE_ENV"] !== "testing") && Debugger.debug("Initialization", version);
    }

    void Version();
})();
