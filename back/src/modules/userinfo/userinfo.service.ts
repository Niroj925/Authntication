import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Auth } from '../auth/entities/auth.entity';

import { Userinfo } from './entities/userinfo.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';

@Injectable()
export class UserinfoService {
  constructor(
    @InjectRepository(Userinfo)
    private readonly userInfoRepository:Repository<Userinfo>,

    @InjectRepository(Auth)
    private readonly userRepository:Repository<Auth>

  ){}

 async create(userId:string,createUserinfoDto: CreateUserinfoDto) {

      try{
        const user=await this.userRepository.findOne({where:{id:userId}});
    
        if(!user){
          throw new NotFoundException('user not found');
        }
    
        const userinfo=this.userInfoRepository.create({
            ...createUserinfoDto,
            user
        })
    
        // return this.userInfoRepository.save(userinfo);
        return this.userInfoRepository.save(userinfo).then(savedUserinfo => ({
          id: savedUserinfo.id,
          name: savedUserinfo.hobbies,
          user: {
            id: user.id,
            email: user.email,
          },
        }))

      }catch(err){
        throw new InternalServerErrorException(err);
      }
  }

async findAll() {
  try{
  const hobbies=await this.userInfoRepository.find();
  return hobbies;
  }catch(err){
    console.log(err);
  }
  
  }

  async findOne(id: string) {
    const userInfo= await this.userInfoRepository.find({where:{id}});

    return userInfo;
  }

  update(id: number, updateUserinfoDto: UpdateUserinfoDto) {
    return `This action updates a #${id} userinfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} userinfo`;
  }
}
