//{
//    "_id": {
//    "$oid": "62c3747a73b4f19a6acd6b42"
//},
//    "id": "f8a34fdc-0001-4619-91de-cc6c207fbd4d",
//    "email": "administrator@internal.io",
//    "description": "Quam explicabo ipsa quo ratione doloribus debitis.",
//    "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1174.jpg",
//    "comment": [
//    "circuit",
//    "exploit",
//    "CFA"
//],
//    "username": "administrator",
//    "password": "$2a$05$RTKeUNQifHYd1B6yLsOluemu.3xfbe3O5y/vZplGQRh2tebzbX1Ye",
//    "rotation": {
//    "$date": "2022-09-14T07:44:45.797Z"
//},
//    "login": {
//    "date": {
//        "$date": "2022-10-26T01:57:38.091Z"
//    },
//    "expiration": {
//        "$date": "2022-10-26T23:19:04.000Z"
//    },
//    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkFwcGxpY2F0aW9uL0pXVCJ9.eyJpZCI6IjYyYzM3NDdhNzNiNGYxOWE2YWNkNmI0MiIsInNjb3BlcyI6W10sImlhdCI6MTY2NjczOTk0NCwiZXhwIjoxNjY2ODI2MzQ0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0Ojg0NDMvIiwic3ViIjoiYWRtaW5pc3RyYXRvciJ9.qAbi84nJa4FqzuTTPAOsdm8UAAhXXCOGqdSnCOZa5WQ",
//        "origin": "127.0.0.1"
//},
//    "role": 4,
//    "entitlements": [
//    "Methodologies",
//    "Deliverables",
//    "Applications",
//    "Synergies",
//    "Aggregate",
//    "Expedite"
//],
//    "version": "8.6.2",
//    "creation": {
//    "$date": "2021-08-31T19:46:34.855Z"
//},
//    "modification": {
//    "$date": "2022-06-17T23:33:42.215Z"
//},
//    "name": "Jacob Sanders"
//}

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