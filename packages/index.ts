export async function Package() {
    const Core = await import("./core");
    const Database = await import("./database");
    const Middleware = await import("./middleware");
    const Routing = await import("./routing");
    const Schema = await import("./schema");
    const Service = await import("./service");
    const TLS = await import("./tls");
    const Utilities = await import("./utilities");

    return {
        Core, Database, Middleware, Routing, Schema, Service, TLS, Utilities
    };
}

export default Package;