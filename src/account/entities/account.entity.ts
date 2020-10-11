import { Entity, Column, PrimaryGeneratedColumn, OneToOne, BaseEntity, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IAccount } from '../types';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Account extends BaseEntity {
  constructor({ id, email, firstName, lastName, phoneNumber, user }: Partial<IAccount> = {}) {
    super();

      this.id = id;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.phoneNumber = phoneNumber;
      this.user = user;
  }

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text' })
  email: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true, default: null })
  firstName: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true, default: null })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'int' , nullable: true, default: null })
  phoneNumber: string;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User, user => user.account, { nullable: true, eager: true })
  @JoinColumn({ name: 'user' })
  user: User;
}