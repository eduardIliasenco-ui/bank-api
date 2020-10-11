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
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        @Inject(JwtConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtConfig>,
        private readonly jwtService: JwtService,
    ) {}

    async create(userProps: UserDTO): Promise<Partial<User>> {
        const accountSave = new Account({ email: userProps.email, user: null, lastName: null, firstName: null, phoneNumber: null });
        const account = await this.accountRepository.save(accountSave);
        const userSave = new User({ ...userProps, account });
        const user = await this.userRepository.save(userSave);

        return await this.generateToken(user);
    }

    async getUserByEmailAndPass({ email, password }: UserDTO): Promise<User> {
        const passHash = createHmac('sha256', password).digest('hex');

        return await this.userRepository.findOneOrFail({ email }, { relations: ['account'] })
    }

    async validateUser(userProps: UserDTO): Promise<User> {
        const user = await this.getUserByEmailAndPass(userProps);

        if (!user) {
            throw new UnauthorizedException('Wrong email or password.');
        }

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await User.findOne({ email }, { relations: ['account'] });
        
        return user;
    }

    async validateUserByEmail(email: string): Promise<User> {
        const user = await this.getUserByEmail(email);

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
