import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserinfoService } from './userinfo.service';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { Userinfo } from './entities/userinfo.entity';
import { AtGuard} from 'src/helper/middlewares/auth/guard';
// import { JwtGuard } from 'src/helper/middlewares/auth/guards/jwt.guard';
import { JwtGuard } from 'src/helper/middlewares/auth/guards/jwt.guard';

// @UseGuards(JwtGuard)
@UseGuards(AtGuard)
@Controller('user')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}

   @Post('hobbies')
  create(@Req() request:any, @Body() createUserinfoDto:CreateUserinfoDto, @Req() req:any){
    console.log('cookies :',request.cookies);
    const user = req.user; 
    const userId=user.id;
    return this.userinfoService.create(userId,createUserinfoDto)
  }

  @Get('hobbies')
  findAll() {
    return this.userinfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userinfoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserinfoDto: UpdateUserinfoDto) {
    return this.userinfoService.update(+id, updateUserinfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userinfoService.remove(+id);
  }
}
