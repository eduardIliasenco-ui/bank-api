import { Entity, Column, PrimaryGeneratedColumn, OneToOne, BaseEntity, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordTransformer } from '../password.transformer';
import { IUser } from '../types';
import { Account } from 'src/account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  constructor({ id, email, password, account }: Partial<IUser> = {}) {
    super();

      this.id = id;
      this.email = email;
      this.password = password;
      this.account = account;
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  email: string;

  @Column({
      name: 'password',
      length: 255,
      transformer: new PasswordTransformer(),
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ type: () => Account })
  @OneToOne(() => Account, account => account.user)
  account: Account;
}