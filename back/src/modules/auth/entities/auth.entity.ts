
import { Userinfo } from "src/modules/userinfo/entities/userinfo.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RefreshToken } from "./refresh.entity";

@Entity('user')
export class Auth {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    email:string

    @Column()
    password:string

    @OneToOne(()=>RefreshToken,rt=>rt.user)
    rt:RefreshToken

    @OneToMany(()=>Userinfo,userinfo=>userinfo.user)
    userinfo:Userinfo[]
}
