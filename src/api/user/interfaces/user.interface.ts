export interface User {
  userId?: number;
  username?: string;
  password?: string;
  createdAt?: Date;
  phoneNumber?: string;
  smsOTP?: string;
  otpExpirationDate?: Date;
}
