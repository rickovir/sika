import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRO } from './users.ro';

@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn()
    ID:number;

    @Column()
    nama:string;

    @Column()
    username:string;

    @Column()
    password:string;

    @Column({default: new Date()})
    createdDate:Date;

    @Column()
    refreshToken:string;

    @Column()
    refreshTokenExpires:number;

    @Column({ default: 0 })
    isDeleted:number;

    @BeforeInsert()
    hashPassword()
    {
        var salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    @BeforeInsert()
    initDate()
    {
        this.createdDate = new Date();
    }

    comparePassword(attempt:string):boolean
    {
        return bcrypt.compareSync(attempt,this.password);
    }

    toResponseObject(showToken:boolean = true):UserRO
    {
        const {ID, nama, username} = this;
        const response:UserRO = {ID, nama, username};
        return response;
    }
}