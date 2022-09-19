import type { Server } from "@iac-factory/api-services";

export function Middleware( server: Server ) {
    const Promises = Promise.allSettled( (
        [
            import("./initialize").then( ( Module ) => Module.Initialize( server ) ),
            import("./body").then( ( Module ) => Module.Body( server ) ),
            import("./timestamp").then( ( Module ) => Module.Timestamp( server ) ),
            import("./headers").then( ( Module ) => Module.Headers( server ) ),
            import("./user-agent").then( ( Module ) => Module.Agent( server ) ),
            import("./cors").then( ( Module ) => Module.CORS( server ) ),
            import("./compression").then((Module) => Module.Compress(server)),
            import("./content-type").then( ( Module ) => Module.Set( server ) ),
        ]
    ) );

    return Promises;
}

void ( async () => await import("./crypto") )();