import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getSuccess(@Query() query, @Res() res) {
    console.log('Received Request');
    res.status(HttpStatus.OK).send({
      success: true,
    });
  }
}
