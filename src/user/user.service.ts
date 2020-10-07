import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';
import { IUser } from './types';

import JwtConfig from 'src/config/jwt-config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(JwtConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtConfig>,
        private readonly jwtService: JwtService,
    ) {}

    async create(userProps: UserDTO): Promise<Partial<User>> {
        const user = new User(userProps);
        const savedUser = await this.userRepository.save(user);

        return await this.generateToken(savedUser);
    }

    async getUserByEmailAndPass({ email, password }: UserDTO): Promise<IUser> {
        const passHash = createHmac('sha256', password).digest('hex');

        return await this.userRepository
            .createQueryBuilder()
            .select('email')
            .where('email = :email and password = :password',  { email, password: passHash })
            .execute();
    }

    async validateUser(userProps: UserDTO): Promise<IUser> {
        const user = await this.getUserByEmailAndPass(userProps);

        if (!user) {
            throw new UnauthorizedException('Wrong email or password.');
        }

        return user;
    }

    async generateToken(user: IUser): Promise<any> {
        return {
            expiresIn: this.jwtConfig.expirationTime,
            accessToken: this.jwtService.sign({ ...user }),
        };
    }
}
