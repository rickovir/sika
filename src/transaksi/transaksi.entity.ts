import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne } from "typeorm";

@Entity('transaksi')
export class TransaksiEntity{
    @PrimaryGeneratedColumn()
    ID:number;

    @Column()
    IDRef:number;

    @Column()
    IDTransaksiLink:number;

    @Column()
    nomorKas:string;

    @Column()
    tanggal:Date;

    @Column()
    total:number;

    @Column()
    saldoSebelum:number;

    @Column()
    saldoSekarang:number;

    @Column({default:0})
    isDeleted:number;
}