import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import * as phoneToken from 'generate-sms-verification-code';
import * as moment from 'moment';
import * as twilio from 'twilio';
import * as dotenv from 'dotenv';

// loading .env file
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = twilio(accountSid, authToken);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async loginUser(user: User) {
    const retrievedUser = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (retrievedUser) {
      return {
        success: await bcrypt.compare(user.password, retrievedUser.password),
        retrievedUser,
      };
    } else {
      return { success: false };
    }
  }

  generateUserVerificationCode() {
    return phoneToken(4);
  }

  async sendSMSToUser(user: User, body: string) {
    const smsSent = await client.messages.create({
      body,
      to: user.phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return !!smsSent.sid;
  }

  async sendUserVerificationCode(user: User) {
    const verificationCode = this.generateUserVerificationCode();

    await this.userRepository.update(user.userId, {
      smsOTP: verificationCode,
      otpExpirationDate: moment().add(5, 'm').toDate(),
    });

    const smsSent = await this.sendSMSToUser(
      user,
      `Your verification code is: ${verificationCode}`,
    );

    return smsSent;
  }

  async verifyUserCode(userId: number, verificationCode: string) {
    const retrievedUser = await this.userRepository.findOne({ userId });

    if (verificationCode !== retrievedUser.smsOTP) {
      return { success: false, errorMessage: 'Wrong verification code' };
    } else if (moment().isAfter(retrievedUser.otpExpirationDate)) {
      return { success: false, errorMessage: 'Verification code expired' };
    } else {
      return { success: true };
    }
  }
}
