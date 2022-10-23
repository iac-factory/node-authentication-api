// import "@jest/globals";
//
// import "dotenv/config";
//
// process.env["NODE_ENV"] = "testing";

export default async function Global () {
    void await import("dotenv/config");

    process.env["NODE_ENV"] = "testing";
}
