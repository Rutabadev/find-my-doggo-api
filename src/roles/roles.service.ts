import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  findByStrings(roles: string[]): Promise<Role[]> {
    return this.roleRepository.find({ name: In(roles || []) });
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
