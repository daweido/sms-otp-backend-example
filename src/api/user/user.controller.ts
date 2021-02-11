import { Controller, Get, Res, HttpStatus, Body, Post } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getSuccess(@Res() res) {
    res.status(HttpStatus.OK).send({
      success: true,
    });
  }

  @Post('/login')
  async loginUser(
    @Body()
    user: User,
    @Res() res,
  ) {
    const loginRes = await this.userService.loginUser(user);
    let smsSent = false;

    if (loginRes.success) {
      smsSent = await this.userService.sendUserVerificationCode(
        loginRes.retrievedUser,
      );
    }

    res.status(HttpStatus.OK).send({
      success: loginRes.success && smsSent,
      userId: loginRes?.retrievedUser.userId,
    });
  }

  @Post('/verifyCode')
  async verifyUserCode(@Body() data, @Res() res) {
    const verificationResult = await this.userService.verifyUserCode(
      data.userId,
      data.verificationCode,
    );

    res.status(HttpStatus.OK).send({
      success: verificationResult.success,
      errorMessage: verificationResult.errorMessage,
    });
  }
}
