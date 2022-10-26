import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { BaseEntity } from "typeorm";
import { ManyToOne } from "typeorm";
import { JoinTable } from "typeorm";
import { BeforeInsert as Pre } from "typeorm";

import { Form } from ".";

export enum Input {
    "button" = "button",
    "checkbox" = "checkbox",
    "color" = "color",
    "date" = "date",
    "datetime-local" = "datetime-local",
    "email" = "email",
    "file" = "file",
    "hidden" = "hidden",
    "image" = "image",
    "month" = "month",
    "number" = "number",
    "password" = "password",
    "radio" = "radio",
    "range" = "range",
    "reset" = "reset",
    "search" = "search",
    "submit" = "submit",
    "tel" = "tel",
    "text" = "text",
    "time" = "time",
    "url" = "url",
    "week" = "week",

    "textarea" = "textarea"
}

export enum Autofill {
    on = "on",
    off = "off"
}

@Entity()
export class Field extends BaseEntity /* implements Model.Schema */ {
    @PrimaryGeneratedColumn("uuid") id!: string;

    /***
     * HTML Input Element's `id` DOM Value
     * */
    @Column({
        name: "html-id",
        type: "varchar",
        length: 256,
        unique: false,
        nullable: false
    }) identifier!: string;

    /***
     * HTML Input Element's `type` DOM Value
     *
     * @see {@link Input} for more information
     * */
    @Column({
        name: "html-type",
        type: "enum",
        unique: false,
        nullable: false,
        default: Input.text,
        enum: Input,
        enumName: "HTML-Input-Element-Type-Enumeration"
    }) type!: keyof typeof Input | string;

    /***
     * HTML Input Element's `autofill` DOM Value
     *
     * @see {@link Autofill} for more information
     */
    @Column({
        name: "html-autofill",
        type: "enum",
        unique: false,
        nullable: false,
        default: Autofill.on,
        enum: Autofill,
        enumName: "HTML-Input-Element-Autofill-Enumeration"
    }) autofill!: keyof typeof Autofill | string;

    /***
     * The Row that the HTML Input Element Should be Placed
     */
    @Column({
        name: "html-row",
        type: "integer",
        unique: false,
        nullable: false
    }) row!: number;

    /***
     * The Input Element's Label DOM Value
     */
    @Column({
        name: "html-label",
        type: "varchar",
        length: 255,
        unique: false,
        nullable: true,
        default: null
    }) label?: string | null

    /***
     * The Input Element's Placeholder-Field Value
     */
    @Column({
        name: "html-placeholder",
        type: "varchar",
        length: 255,
        unique: false,
        nullable: true,
        default: null
    }) placeholder?: string | null

    @ManyToOne(() => Form, (form) => form.fields, {
        eager: false
    }) form!: Form;

    /***
     * Returns the data-structure required to load-in foreign-key relationship(s)
     *
     * @example
     *
     * const repository = Postgres.getRepository(Field);
     * const entities = await repository.find( {... Field.relations, { ... } } );
     *
     */
    static get relations() {
        return {
            relations: {
                form: true
            }
        } as const;
    }

    // @Pre()
    // /***
    //  * Before Insertion, Establish Defaults.
    //  */
    // async initialize() {
    //     if (!(this.fluid)) {
    //         this.fluid = true;
    //     }
    // }
}

export default Field;