import "reflect-metadata";

import Path from "path";

import { DataSource } from "typeorm";

export const Postgres = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "kZ7-V4Fc4Db_9BRJeyMmB+9n+ucD=%Ul",
    database: "postgres",
    synchronize: true,
    logging: (process.env["NODE_ENV"] !== "testing") ? true : false,
    uuidExtension: "uuid-ossp",
    dropSchema: true,
    migrationsRun: true,
    entities: [
        __dirname + Path.sep + "entity" + Path.sep + "**" + Path.sep + "*.js"
    ],
    migrations: [
        __dirname + Path.sep + "migration" + Path.sep + "**" + Path.sep + "*.js"
    ],
    subscribers: [
        __dirname + Path.sep + "subscriber" + Path.sep + "**" + Path.sep + "*.js"
    ]
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
void (async () => (process.env["NODE_ENV"] !== "testing") && await Postgres.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.trace(error))
)();

export default Postgres;