import { Entity } from "typeorm";
import { PrimaryColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { BaseEntity } from "typeorm";
import { ColumnType } from "typeorm/";

import { User as Model } from "../../..";

@Entity()
export class User extends BaseEntity implements Model.Schema {
    @PrimaryGeneratedColumn("uuid") id!: string;

    @PrimaryColumn({
        name: "email-address",
        type: "varchar",
        unique: true,
        nullable: false
    }) email!: string;

    @PrimaryColumn({
        name: "username",
        type: "varchar",
        unique: true,
        nullable: false
    }) username!: string;

    @Column({
        name: "first-name",
        type: "varchar",
        unique: false,
        nullable: false
    }) firstname!: string;

    @Column({
        name: "last-name",
        type: "varchar",
        unique: false,
        nullable: false
    }) lastname!: string;

    @Column({
        name: "description",
        type: "varchar",
        unique: false,
        nullable: true,
        default: null
    }) description!: string;

    @Column({
        name: "avatar",
        type: "varchar",
        unique: false,
        nullable: true,
        default: null
    }) avatar!: string;

    @Column({
        name: "note",
        type: "varchar",
        unique: false,
        nullable: true,
        default: null
    }) note!: string;

    @Column({
        name: "password",
        type: "varchar",
        unique: false,
        nullable: false
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
}
