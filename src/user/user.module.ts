import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwtConfig.secret'),
        signOptions: {
          expiresIn: config.get('jwtConfig.expirationTime'),
        }
      }),
    }),
    TypeOrmModule.forFeature([User, Account])
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController]
})
export class UserModule {}
