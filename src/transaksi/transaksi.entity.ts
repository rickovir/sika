import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne } from "typeorm";

@Entity('transaksi')
export class TransaksiEntity{
    @PrimaryGeneratedColumn()
    ID:number;

    @Column()
    refID:number;

    @Column()
    transaksiLinkID:number;

    @Column()
    nomorKas:string;

    @Column("datetime")
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