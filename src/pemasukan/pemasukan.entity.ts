import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, OneToOne } from "typeorm";
import { JenisEntity } from "src/jenis/jenis.entity";

@Entity('pemasukan')
export class PemasukanEntity{
    @PrimaryGeneratedColumn()
    ID:number;

    @Column()
    nomorKas:string;

    @Column()
    tanggal:Date;

    @Column()
    namaPenanggungJawab:string;

    @Column()
    judul:string;

    @Column()
    imageUrl:string;

    @Column()
    keterangan:string;

    @Column()
    jumlah:number;

    @Column({default:0})
    isDeleted:number;

    @ManyToOne(type=>JenisEntity, jenis=>jenis.pemasukan)
    jenis:JenisEntity;
}