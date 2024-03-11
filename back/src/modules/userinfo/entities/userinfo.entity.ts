// import { Auth } from "src/modules/auth/entities/auth.entity";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('userinfo')
export class Userinfo {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    hobbies:string
    
    @ManyToOne(()=>Auth,(user)=>user.userinfo)
    user:Auth;

}
