export const Address = {
    port:     parseInt( process.env[ "SERVER_PORT" ] ?? "3000" ),
    hostname: process.env[ "SERVER_HOSTNAME" ] ?? "localhost",
    https:    ( ( process.env[ "HTTPS" ] ?? "false" ) === "true" ),
    get uri() {
        return [
            this.hostname,
            ":",
            this.port
        ].join( "" )
    },
    get url() {
        return ( ( this.https ) ? "https" : "http" ) + "://" + this.uri;
    }
};

export default Address;