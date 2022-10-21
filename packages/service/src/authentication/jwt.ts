/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { v4 as UUID } from "uuid";

import Token, { SignOptions } from "jsonwebtoken";

import { Context } from "@iac-factory/api-database";

import { Logger } from "@iac-factory/api-utilities";

const Log = new Logger("Authorization");

const Compare = async (password: string, hash: string): Promise<[ boolean, string ]> => {
    const { compare } = await import("bcryptjs");

    Log.debug("JWT-Comparator", {password, hash});

    return new Promise((resolve, reject) => {
        compare(password, hash, function (exception, success: boolean) {
            if (exception) return reject(exception);

            if (!success) {
                resolve([ false, "Invalid" ]);
            } else {
                resolve([ true, "Successful" ]);
            }
        });
    });
};

/***
 * JWT Login Generation
 * ---
 *
 * @param {string} server
 * @param {string} ip
 * @param {string} username
 * @param {string} password
 *
 * @returns {void}
 *
 * @constructor
 */
export const JWT = async (server: string, ip: string, username: string, password: string): Promise<string | null> => {
    const context = await Context.Connection();
    const database = context.db("Authentication");
    const users = database.collection("User");

    Log.debug("JWT-Generator", {server, ip, username, password});

    const record = await users.findOne({ username: username.toLowerCase() });

    if (!(record)) return null;

    /*** Validate the User's Password --> Hash */
    const [ valid, _ ] = await Compare(password, record.password);

    if (!(valid)) return null;

    const { _id: id } = record;
    const fields: SignOptions = {
        subject: username.toLowerCase(),
        issuer: "Internal",
        expiresIn: "1d",
        algorithm: "HS256",
        encoding: "utf-8",
        header: {
            alg: "HS256",
            typ: "JWT",
            cty: "Application/JWT"
        }
    };

    return new Promise((resolve) => {
        Token.sign({
            id,
            uid: UUID()
        }, process.env["SECRET"]!, fields, async (exception, token) => {
            if (exception) throw exception;
            if (!(token)) throw new TypeError("Token Cannot be Undefined");

            const time = new Date(Date.now());
            const expiration = new Date(Date.now() + 24 * (60 * 60 * 1000));

            const session = {
                date: time,
                expiration: expiration,
                token: token,
                origin: ip
            };

            await users.updateOne(
                { _id: record._id },
                { $set: { login: session } },
                { upsert: false }
            );

            resolve(token);
        });
    });
};

export default JWT;
