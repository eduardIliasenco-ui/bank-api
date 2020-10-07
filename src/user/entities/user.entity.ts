import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordTransformer } from '../password.transformer';
import { IUser } from '../types';

@Entity()
export class User {
  constructor({ id, email, password }: Partial<IUser> = {}) {
      this.id = id;
      this.email = email;
      this.password = password;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
      name: 'password',
      length: 255,
      transformer: new PasswordTransformer(),
  })
//   @Exclude()
  password: string;
}