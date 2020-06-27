import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PemasukanEntity } from "src/pemasukan/pemasukan.entity";

@Entity('jenis')
export class JenisEntity{
    @PrimaryGeneratedColumn()
    ID:number;

    @Column()
    nama:string;

    @Column({ length:2 })
    tipe:string;

    @Column({default:0})
    isDeleted:number;

    @OneToMany(type=>PemasukanEntity, pemasukan=>pemasukan.jenis)
    pemasukan:PemasukanEntity[];
}