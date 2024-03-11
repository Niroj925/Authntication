import { AuthGuard } from "@nestjs/passport";


export class AtGuard extends AuthGuard('jwt_access'){
    constructor(){
        super();
    }
    
}