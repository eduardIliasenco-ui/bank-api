import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import jwtConfig from 'src/config/jwt-config';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      load: [
        jwtConfig,
      ],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        name: 'default',
        dropSchema: false,
        autoSchemaSync: true,
        type: 'sqlite',
        database: './db/db.sqlite',
        synchronize: true,
        autoLoadEntities: true,
        migrationsRun: false,
        logging: true,
        keepConnectionAlive: true,
      }),
    }),
    UserModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
