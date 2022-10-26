import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { BaseEntity } from "typeorm";
import { OneToMany } from "typeorm";
import { JoinTable } from "typeorm";
import { BeforeInsert as Pre } from "typeorm";

import { Field } from ".";

@Entity()
export class Form extends BaseEntity /* implements Model.Schema */ {
    @PrimaryGeneratedColumn("uuid") id!: string;

    /***
     * HTML Input Form's `id` DOM Value
     * */
    @Column({ name: "html-form-id", type: "varchar", length: 256, unique: true, nullable: false })
    identifier!: string;

    /***
     * HTML Form's Page Width Fluid Setting
     * */
    @Column({ name: "html-form-fluid", type: "boolean", unique: false, nullable: false, default: true })
    fluid!: boolean;

    /***
     * HTML Form's Page Title String Value
     * */
    @Column({ name: "html-form-title", type: "varchar", length: 256, unique: false, nullable: false })
    title!: string;

    @OneToMany(() => Field, (field) => field.form, {
        eager: true
    }) @JoinTable()
    fields!: Field[];

    /***
     * Returns the data-structure required to load-in foreign-key relationship(s)
     *
     * @example
     *
     * const repository = Postgres.getRepository(Form);
     * const entities = await repository.find( {... Form.relations, { ... } } );
     *
     */
    static get relations() {
        return {
            relations: {
                fields: true
            }
        } as const;
    }

    @Pre()
    /***
     * Before Insertion, Establish Defaults.
     */
    async initialize() {
        if (!(this.fluid)) {
            this.fluid = true;
        }
    }
}

export default Form;