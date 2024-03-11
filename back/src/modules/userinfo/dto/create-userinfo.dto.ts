import { IsString } from "class-validator";

export class CreateUserinfoDto {
    @IsString()
    hobbies:string
}
