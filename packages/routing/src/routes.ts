import { Router } from ".";

/*** Route Imports via Importable Side-Effects */
export default void ( async () => {
    const Routing = [
        import("./schema").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./utility").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./utility/health").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./utility/health/memory").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./utility/health/postgresql").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./utility/health/document-db").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./utility/document-db").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./utility/document-db/indexes").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./login").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./authorization").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./authorization/jwt").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users/pagination").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users/indexes").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users/statistics").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users/total").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users/search").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users/search/id").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } ),
        import("./users/pagination/metadata").then( ( route ) => {
            // Logger.debug(route.default.registry);
            Router.use( route.default );
        } )
    ];

    return Promise.allSettled( Routing );
} )();