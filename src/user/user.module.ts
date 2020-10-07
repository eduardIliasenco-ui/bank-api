import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
