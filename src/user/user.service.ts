import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"; 
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ){}

    async findByEmail(email: string){
        return this.userRepo.findOne({ where: { email } });
    }

    async create(email: string, password: string, role: string) {
    const user = this.userRepo.create({ email, password, role });
    return this.userRepo.save(user);
  }
}