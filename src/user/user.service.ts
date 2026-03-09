import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  create(createUserDto: CreateUserDto): Promise<User> {
    let user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /** QueryBuilder: filtering by optional name & email */
  findFiltered(filters: { name?: string; email?: string }): Promise<User[]> {
    const qb = this.userRepository.createQueryBuilder('user');
    if (filters.name) qb.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.email) qb.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    return qb.getMany();
  }

  /** QueryBuilder: join User with Profile */
  findWithProfile(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .getMany();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
