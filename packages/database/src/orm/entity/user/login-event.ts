import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { BaseEntity } from "typeorm";
import { BeforeInsert as Pre } from "typeorm";

@Entity()
export class Login extends BaseEntity {
    @PrimaryGeneratedColumn( "uuid" ) id!: string;

}

export default Login;