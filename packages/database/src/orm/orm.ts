import "reflect-metadata";

import Path from "path";

import { createConnection } from "typeorm";

createConnection(
    {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "kZ7-V4Fc4Db_9BRJeyMmB+9n+ucD=%Ul",
        database: "postgres",
        synchronize: true,
        logging: true,
        uuidExtension: "uuid-ossp",
        dropSchema: true,
        entities: [
            __dirname + Path.sep + "entity" + Path.sep + "**" + Path.sep + "*.js"
        ],
        migrations: [
            __dirname + Path.sep + "migration" + Path.sep + "**" + Path.sep + "*.js"
        ],
        subscribers: [
            __dirname + Path.sep + "subscriber" + Path.sep + "**" + Path.sep + "*.js"
        ]
    }).then((connection) => {
    // here you can start to work with your entities
}).catch(error => console.trace(error));