import { PartialType } from '@nestjs/mapped-types';
import { CreateUserinfoDto } from './create-userinfo.dto';

export class UpdateUserinfoDto extends PartialType(CreateUserinfoDto) {}
