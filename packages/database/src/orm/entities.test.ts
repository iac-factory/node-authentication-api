import { faker } from "@faker-js/faker";

import { Connection } from ".";

import Hydrate, { Timers, Logger, Initialize } from "@iac-factory/unit-testing";

const Debugger = new Logger("ORM-Entities");

describe("Entities Establishment(s)", function() {
    Hydrate() && Initialize() && Timers.Long();

    afterAll(async () => {
        await Connection.close();
    });

    beforeEach(async () => {
        await Connection.clear();
    });

    test("Resolves Before + After Callable(s) for Entities", async function() {
        void null;
    });

    test("Functional User Class", async function Class () {
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

    test("ORM User Record", async function Record () {
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

    test("ORM User Record (Default Dates)", async function Dates () {
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
        /*** entity.creation = new Date(); */
        /*** entity.modification = new Date(); */
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
});