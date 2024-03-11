
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "./auth.entity";
import * as bcrypt from 'bcrypt';

@Entity('token')
export class RefreshToken {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    refreshtoken:string

    @OneToOne(()=>Auth,user=>user.rt)
    @JoinColumn()
    user:Auth
}
