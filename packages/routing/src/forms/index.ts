import Router, { X, Endpoint } from "./definition";

import { Default } from "@iac-factory/api-authentication-services";

const Information = Default.Response();

// Router.all( Endpoint.route, async ( request, response ) => {
//     Information.evaluate( Endpoint.route, response );
// } );

Router.post(Endpoint.route, async (request, response) => {
    const body: Post = request.body;

    const {
        Postgres,
        Form,
        Field
    } = await import("@iac-factory/api-authentication-database");

    const form = new Form();

    const forms = Postgres.getRepository(Form);
    const fields = Postgres.getRepository(Field);

    if (!(body.form.identifier)) {
        response.status(422);
        response.send({
            exception: "Null Form Identifier (identifier) Field",
            message: "Please Specify Form Identifier (form.identifier)",
            payload: { ...request.body }
        });
    } else if (!(body.form.title)) {
        response.status(422);
        response.send({
            exception: "Null Form Title (title) Field",
            message: "Please Specify Form Title (form.title)",
            payload: { ...request.body }
        });
    } else if (await forms.findOne({ where: { identifier: body.form.identifier } })) {
        response.status(409);
        response.send({
            exception: "Form Identifier (identifier) Field Conflict",
            message: "The Form Identifier Field Must be Unique",
            payload: { ...request.body }
        });
    } else {
        form.title = body.form.title;
        form.fluid = body.form.fluid;
        form.identifier = body.form.identifier;

        const elements = body.fields.map((entity) => {
            const field = new Field();

            field.identifier = entity.identifier;
            field.type = entity.type;
            field.autofill = entity.autofill;
            field.row = entity.row;
            field.label = entity.label;
            field.placeholder = entity.placeholder;

            field.form = form;

            return field;
        });

        await forms.save([ form ]);
        await fields.save(elements);

        const data = await forms.findOne({
            where: {
                identifier: form.identifier
            }
        });

        response.status(X["X-Default-Response"]);

        response.send({ form: data });
    }
});

Router.get(Endpoint.route, async (request, response) => {
    const { identifier } = request.query;

    if (!(identifier)) {
        response.status(422);

        response.send({
            exception: "Null Form Identifier (identifier) Field",
            message: "Please Specify Form Identifier (form.identifier) as Query Parameter",
            payload: { query: request.query }
        });
    } else {
        const {
            Postgres,
            Form
        } = await import("@iac-factory/api-authentication-database");

        const forms = Postgres.getRepository(Form);

        const target = await forms.findOne({ where: { identifier: (identifier as string) } });

        if (!(target)) {
            response.status(406);
            response.statusMessage = "Entity Not Found";

            response.send({
                exception: "Form Record Not Found",
                message: "Please Specify an Existing, Valid Form Identifier",
                payload: { ...request.body }
            });
        } else {
            response.status(X["X-Default-Response"]);
            response.statusMessage = "Successful";

            response.send(target);
        }
    }
});

Router.put(Endpoint.route, async (request, response) => {
    const body: Put = request.body;

    const { form: { identifier } } = body;

    if (!(identifier)) {
        response.status(422);

        response.send({
            exception: "Null Form Identifier (identifier) Field",
            message: "Please Specify Form Identifier (form.identifier)",
            payload: { ...request.body }
        });
    } else {
        const { Postgres } = await import("@iac-factory/api-authentication-database");
        const { Form } = await import("@iac-factory/api-authentication-database");

        const forms = Postgres.getRepository(Form);

        const target = await forms.findOne({ where: { identifier: (identifier as string) } });

        if (!(target)) {
            response.status(406);
            response.statusMessage = "Entity Not Found";

            response.send({
                exception: "Form Record Not Found",
                message: "Please Specify an Existing, Valid Form Identifier",
                payload: { ...request.body }
            });
        } else {
            const { title } = body;
            const { fluid } = body;

            target.title = title?.trim() ?? target.title.trim();
            target.fluid = fluid ?? target.fluid;

            await target.save();

            response.status(X["X-Default-Response"]);
            response.statusMessage = "Successful";

            response.send(target);
        }
    }
});

Router.delete(Endpoint.route, async (request, response) => {
    const body: Delete = request.body;

    const {
        Postgres,
        Form,
        Field
    } = await import("@iac-factory/api-authentication-database");

    const forms = Postgres.getRepository(Form);
    const fields = Postgres.getRepository(Field);

    if (!(body.form.identifier)) {
        response.status(422);
        response.send({
            exception: "Null Form Identifier (identifier) Field",
            message: "Please Specify Form Identifier (form.identifier)",
            payload: { ...request.body }
        });
    } else {
        const target = await forms.findOne({ where: { identifier: body.form.identifier } });

        if (!(target)) {
            response.status(406);
            response.statusMessage = "Entity Not Found";

            response.send({
                exception: "Form Record Not Found",
                message: "Please Specify an Existing, Valid Form Identifier",
                payload: { ...request.body }
            });
        } else {
            await fields.remove(target.fields);
            await forms.remove([ target ]);

            response.status(X["X-Default-Response"]);
            response.statusMessage = "Successful";

            response.send({
                target,
                payload: { ...request.body }
            });
        }
    }
});

/*** Types */

import type { Form } from "@iac-factory/api-authentication-database";
import type { Field } from "@iac-factory/api-authentication-database";

export interface Delete {
    form: Form;
}

export interface Post {
    form: Form,
    fields: Field[]
}

export interface Put {
    form: Form;

    title?: string,
    fluid?: boolean
}

export interface Get {
    form: Form;
}

export default Router;
