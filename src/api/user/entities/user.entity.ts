import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../interfaces/user.interface';

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  smsOTP: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpirationDate: Date;
}
