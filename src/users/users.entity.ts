import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

    @Column({ default: 0 })
    isDeleted:number;

    @BeforeInsert()
    async hashPassword()
    {
        this.password = await bcrypt.hash(this.password,10);
    }

    @BeforeInsert()
    initDate()
    {
        this.createdDate = new Date();
    }

    async comparePassword(attempt:string):Promise<boolean>
    {
        return await bcrypt.compare(attempt, this.password);
    }

    toResponseObject(showToken:boolean = true):UserRO
    {
        const {ID, nama, username} = this;
        const response:UserRO = {ID, nama, username};
        return response;
    }
}