import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateUserDto, LoginUserDto } from '@common/dtos/create-user.dto';
import { ECmdNames } from '@common/enums/cmd-name.enum';

import { EControllerNames } from '../common/enums/controller-name.enum';
import { UserService } from './user.service';

@Controller(EControllerNames.User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: ECmdNames.Register })
  register(@Payload() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @MessagePattern({ cmd: ECmdNames.Login })
  async login(@Payload() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @MessagePattern({ cmd: ECmdNames.GetUsers })
  getUsers() {
    return this.userService.getUsers();
  }
}
