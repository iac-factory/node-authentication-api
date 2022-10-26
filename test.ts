"use strict";

import Path from "path";
import Configuration from "dotenv";

Configuration.config({
    path: Path.join(__dirname, ".env.qa")
});


const http = require("http");
const https = require("https");



/**
 * This is a class where you can pass in an elasticsearch query json and index directly.
 */
class elasticsearch {
    /**
     * Executes the call to elasticsearch and returns the response.
     * @param {*} indexPath
     * @param {*} esBody
     */
    getESData(indexPath: string, esBody: any) {

        return new Promise((resolve, reject) => {
            let options = {
                host: process.env.ELASTICSEARCH_URL,
                path: indexPath,
                headers: {
                    "Content-Length": Buffer.byteLength(JSON.stringify(esBody)),
                    "Content-Type": "application/json"
                },
                method: "POST"
            };

            console.log({options})

            var requestCallback = (response: import("http").ServerResponse) => {
                var str = "";
                response.on("data", (chunk) => {
                    str += chunk;
                });
                response.on("end", () => {
                    //console.log("end:"+str);
                    resolve(str);
                }).on("error", () => {
                    reject("Unknown error.");
                });
            };

            let json = JSON.stringify(esBody);
            let req = https.request(options, requestCallback);
            req.on("error", (exception: any) => {
                reject({ message: "Elasticsearch - http request error:", exception });
            });

            req.write(json);
            req.end();
        });
    }
}

module.exports = elasticsearch;

void (async () => {
    const ES = new elasticsearch();

    const data = await ES.getESData("/article_read/logs/_search", {});

    console.log(data);
})().catch(console.trace);