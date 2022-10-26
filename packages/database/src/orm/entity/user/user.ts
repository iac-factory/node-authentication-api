import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { BaseEntity } from "typeorm";
import { BeforeInsert as Pre } from "typeorm";

import { Hash } from "./hash";
import { Dates } from "./dates";

enum Age {
    "Age-0" = "18 - 22",
    "Age-1" = "22 - 27",
    "Age-2" = "28 - 34",
    "Age-3" = "35 - 40",
    "Age-4" = "41 - 49",
    "Age-5" = "50 - 60",
    "Age-6" = "61 - 100"
}

@Entity()
export class User extends BaseEntity {
    static get Age () {
        return Age;
    }

    @PrimaryGeneratedColumn("uuid") id!: string;

    @Column({
        name: "email-address",
        type: "varchar",
        length: 256,
        unique: true,
        nullable: false
    }) email!: string;

    @Column({
        name: "username",
        type: "varchar",
        length: 128,
        unique: true,
        nullable: false
    }) username!: string;

    @Column({
        name: "first-name",
        type: "varchar",
        length: 64,
        unique: false,
        nullable: false
    }) firstname!: string;

    @Column({
        name: "last-name",
        type: "varchar",
        length: 64,
        unique: false,
        nullable: false
    }) lastname!: string;

    @Column({
        name: "description",
        type: "varchar",
        length: 4096,
        unique: false,
        nullable: true,
        default: null
    }) description!: string;

    @Column({
        name: "avatar",
        type: "varchar",
        length: 256,
        unique: false,
        nullable: true,
        default: null
    }) avatar!: string;

    @Column({
        name: "note",
        type: "varchar",
        length: 1024,
        unique: false,
        nullable: true,
        default: null
    }) note!: string;

    @Column({
        name: "password",
        type: "varchar",
        length: 512,
        unique: false,
        nullable: false,
    }) password!: string;

    @Column({
        name: "role",
        type: "integer",
        unique: false,
        nullable: false,
        default: 1 << 0
    }) role!: number;

    @Column({
        name: "creation-date",
        type: "date",
        unique: false,
        nullable: false
    }) creation!: Date;

    @Column({
        name: "modification-date",
        type: "date",
        unique: false,
        nullable: false
    }) modification!: Date;

    @Column({
        name: "verification",
        type: "boolean",
        unique: false,
        nullable: false,
        default: false
    }) verification!: boolean;

    @Column({
        name: "consent",
        type: "boolean",
        unique: false,
        nullable: false,
        default: false
    }) consent!: boolean;

    @Column({
        name: "age",
        type: "enum",
        unique: false,
        enum: Age,
        enumName: "User-Age-Enumeration",
        nullable: false
    }) age!: Age;


    @Pre()
    /***
     * Before Insertion, Establish Defaults for Creation and Modification Date(s),
     * and hash the User's Password
     */
    async initialize() {
        void await Dates(this);
        void await Hash(this);
    }
}

export default User;