import { faker } from "@faker-js/faker";

import { Connection } from ".";

import Hydrate, { Timers, Logger, Initialize } from "@iac-factory/unit-testing";

const Debugger = new Logger("ORM-Entities");

describe("Entities Establishment(s)", function() {
    Hydrate() && Initialize() && Timers.Long();

    afterAll(async () => {
        await Connection.close();
    });

    afterEach(async () => {
        await Connection.clear();
    });

    test("Resolves Before + After Callable(s) for Entities", async function() {
        void null;
    });

    test("User Functional Class", async function Class () {
        const { User } = await import(".");

        const entity = new User();

        entity.email = "jsanders4129@gmail.com";
        entity.username = "segmentational";
        entity.firstname = "Jacob";
        entity.lastname = "Sanders";
        entity.avatar = faker.internet.avatar();
        entity.description = "Test Administrative User";
        entity.note = "User Generated via Automated Unit Test";
        entity.password = "Kn0wledge!";
        entity.role = 1 << 30;
        entity.creation = new Date();
        entity.modification = new Date();
        entity.consent = true;
        entity.verification = true;

        entity.age = User.Age["Age-0"];

        Debugger.debug("User", { entity });

        expect(entity).toBeTruthy();
    });

    test("User ORM Record", async function Record () {
        const { User } = await import(".");

        const { Postgres } = await import(".");

        await Postgres.initialize();

        const entity = new User();

        entity.email = "jsanders4129@gmail.com";
        entity.username = "segmentational";
        entity.firstname = "Jacob";
        entity.lastname = "Sanders";
        entity.avatar = faker.internet.avatar();
        entity.description = "Test Administrative User";
        entity.note = "User Generated via Automated Unit Test";
        entity.password = "Kn0wledge!";
        entity.role = 1 << 30;
        entity.creation = new Date();
        entity.modification = new Date();
        entity.consent = true;
        entity.verification = true;

        entity.age = User.Age["Age-0"];

        const repository = Postgres.getRepository(User);

        await repository.save([entity]);

        const entities = await repository.find();

        Debugger.debug("User", { entities });

        expect(entities).toBeTruthy();
    });

    test("User ORM Record (Default Dates)", async function Dates () {
        const { User } = await import(".");

        const { Postgres } = await import(".");

        await Postgres.initialize();

        const entity = new User();

        entity.email = "jsanders4129@gmail.com";
        entity.username = "segmentational";
        entity.firstname = "Jacob";
        entity.lastname = "Sanders";
        entity.avatar = faker.internet.avatar();
        entity.description = "Test Administrative User";
        entity.note = "User Generated via Automated Unit Test";
        entity.password = "Kn0wledge!";
        entity.role = 1 << 30;
        entity.consent = true;
        entity.verification = true;

        entity.age = User.Age["Age-0"];

        const repository = Postgres.getRepository(User);

        await repository.save([entity]);

        const entities = await repository.find();

        Debugger.debug("User", { entities });

        expect(entities).toBeTruthy();
    });

    test("User Password Hashing", async function Hashing () {
        const { User } = await import(".");

        const { Postgres } = await import(".");

        await Postgres.initialize();

        const entity = new User();

        const password = "Kn0wledge!";

        entity.email = "jsanders4129@gmail.com";
        entity.username = "segmentational";
        entity.firstname = "Jacob";
        entity.lastname = "Sanders";
        entity.avatar = faker.internet.avatar();
        entity.description = "Test Administrative User";
        entity.note = "User Generated via Automated Unit Test";
        entity.password = password;
        entity.role = 1 << 30;
        /*** entity.creation = new Date(); */
        /*** entity.modification = new Date(); */
        entity.consent = true;
        entity.verification = true;

        entity.age = User.Age["Age-0"];

        const repository = Postgres.getRepository(User);

        await repository.save([entity]);

        const user = await repository.findOne({
            where: {
                username: "segmentational"
            }
        });

        Debugger.debug("User (Instance)", { password, entity });
        Debugger.debug("User (Record)", { password, user });

        if (!(user)) {
             throw new Error("Error Establishing User Record in Database");
        }

        expect(password === user.password).toBe(false);
        expect(password === entity.password).toBe(false);
    });

    test("Form Functional Class", async function Class () {
        const { Form } = await import(".");

        const entity = new Form();

        entity.title = "Test Form Title";
        entity.fluid = true;
        entity.identifier = "test-form";

        Debugger.debug("Form", { entity });

        expect(entity).toBeTruthy();
    });

    test("Form ORM Record", async function Record () {
        const { Form } = await import(".");

        const { Postgres } = await import(".");

        await Postgres.initialize();

        const entity = new Form();

        entity.title = "Test Form Title";
        entity.fluid = true;
        entity.identifier = "test-form";

        const repository = Postgres.getRepository(Form);

        await repository.save([entity]);

        const entities = await repository.find();

        Debugger.debug("Form", { entities });

        expect(entities).toBeTruthy();
    });

    test("Form ORM Record with Field(s)", async function Record () {
        const { Form } = await import(".");

        const { Postgres } = await import(".");

        await Postgres.initialize();

        const entity = new Form();

        entity.identifier = "test-form";
        entity.fluid = true;
        entity.title = "Test Form Title";

        const repository = Postgres.getRepository(Form);

        await repository.save([entity]);

        const record = await repository.findOne({
            where: {
                identifier: entity.identifier
            }
        });

        Debugger.debug("Form (Pre-Injection)", { record });

        expect(record).toBeTruthy();

        if (!(record)) {
            throw new Error("Fatal Error Locating Form");
        }

        const { id } = record;

        expect(id).toBeTruthy();

        const { Field } = await import(".");

        const field = new Field();

        const fields = Postgres.getRepository(Field);

        field.identifier = "test-field";
        field.type = "text";
        field.autofill = "off";
        field.row = 0;
        field.form = record;

        await fields.save([field]);

        Debugger.debug("Field", { field });

        expect(field).toBeTruthy();

        const update = await repository.findOne({
            where: {
                identifier: entity.identifier
            }
        });

        if (!(update)) {
            throw new Error("Fatal Error Locating Updated Form Record");
        }

        const { fields: children } = update;

        Debugger.debug("Form (Fields)", { children });

        expect(children).toBeTruthy();
    });

    test("Form ORM Record with Defaults + Field(s)", async function Record () {
        const { Form } = await import(".");

        const { Postgres } = await import(".");

        await Postgres.initialize();

        const entity = new Form();

        entity.identifier = "test-form";
        /// entity.fluid = true;
        entity.title = "Test Form Title";

        const repository = Postgres.getRepository(Form);

        await repository.save([entity]);

        const record = await repository.findOne({
            where: {
                identifier: entity.identifier
            }
        });

        Debugger.debug("Form (Pre-Injection)", { record });

        expect(record).toBeTruthy();

        if (!(record)) {
            throw new Error("Fatal Error Locating Form");
        }

        const { id, fluid } = record;

        expect(id).toBeTruthy();
        expect(fluid).toBeTruthy();
    });

    test("Field Functional Class", async function Class () {
        const { Field } = await import(".");

        const entity = new Field();

        entity.identifier = "test-field";
        entity.type = "text";
        entity.autofill = "off";
        entity.row = 0;

        Debugger.debug("Field", { entity });

        expect(entity).toBeTruthy();
    });
});
