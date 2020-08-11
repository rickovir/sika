import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDTO, UpdateRefreshTokenDTO } from './users.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>)
    {
        
    }

    public async findAll():Promise<UserEntity[]>
    {
        return await this.userRepository.find();
    }

    public async findByUsername(username: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ username });
    }

    public async findByRefreshToken(refreshToken: string): Promise<UserEntity | null> {
        return await this.userRepository.findOne({ refreshToken });
    }

    public async findById(id: number): Promise<UserEntity | null> {
        return await this.userRepository.findOneOrFail(id);
    }

    public async create(user: CreateUserDTO): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }

    public async updateRefreshToken(ID:number, data:Partial<UpdateRefreshTokenDTO>)
    {
        const user = await this.userRepository.findOneOrFail(ID);
        if (!user.ID) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }
        await this.userRepository.update(ID, data);
    }

    public async update(
        id: number,
        newValue: CreateUserDTO,
    ): Promise<UserEntity | null> {
        const user = await this.userRepository.findOneOrFail(id);
        if (!user.ID) {
            // tslint:disable-next-line:no-console
            console.error("user doesn't exist");
        }
        await this.userRepository.update(id, newValue);
        return await this.userRepository.findOne(id);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    public async register(userDto: CreateUserDTO) {
        const { username } = userDto;
        let user = await this.userRepository.findOne({ where: { username } });
        if (user) {
            throw new HttpException('User already exists',  HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(userDto);
        await this.userRepository.save(user);
    }
}
