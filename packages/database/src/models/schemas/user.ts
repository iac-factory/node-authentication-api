import crypto from "crypto";

import { faker } from "@faker-js/faker";

export module User {
    export enum ENUMERATION {
        id = "id",
        firstname = "firstname",
        lastname = "lastname",
        email = "email",
        description = "description",
        avatar = "avatar",
        note = "note",
        username = "username",
        password = "password",
        role = "role",
        creation = "creation",
        modification = "modification",
        verification = "verification"
    }

    export interface Schema {
        id: string,
        email: string,
        firstname: string,
        lastname: string,
        description: string | null,
        avatar: string | null,
        note: string | null,
        username: string,
        password: string,
        role: number,
        creation: Date,
        modification: Date,
        verification: boolean
    }

    export type Keys = keyof typeof ENUMERATION;

    export const Validator = (input: any) => {
        const reflection = Object.create({});
        const keys: Keys[] = Object.keys(ENUMERATION) as Keys[];

        for (const [attribute, entry] of Object.entries(input)) {
            if (keys.includes(attribute as Keys)) {
                Reflect.set(reflection, attribute, input[attribute]);
            }
        }

        const attributes = Object.keys(reflection);

        for (const key of keys) {
            if (!(attributes.includes(key))) {
                return false;
            }
        }

        return true;
    }

    export const Generator = (): Schema | null => {
        const first = faker.name.firstName();
        const last = faker.name.lastName();

        const ip = faker.internet.ip();
        const version = ((ip.split(".").length) === 4) ? "ipv4" : "ipv6"

        const structure = {
            id: crypto.randomUUID(),
            email: faker.internet.email(first, last),
            description: faker.lorem.sentences(1),
            firstname: first,
            lastname: last,
            avatar: faker.internet.avatar(),
            note: [ faker.lorem.sentences(1), faker.lorem.sentences(1), faker.lorem.sentences(1) ].join("\n"),
            username: faker.internet.userName(first, last),
            password: faker.internet.password(16),
            role: 1 << faker.datatype.number({
                min: 0,
                max: 31
            }),
            verification: faker.datatype.boolean(),
            creation: new Date(Date.now()),
            modification: new Date(Date.now()),
        };

        return Validator(structure) && structure || null;
    };
}

export default User;