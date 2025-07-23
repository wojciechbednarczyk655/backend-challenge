import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CreateUserDto, LoginUserDto } from '@common/dtos/create-user.dto';
import { ECmdNames } from '@common/enums/cmd-name.enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.client.send({ cmd: ECmdNames.Register }, createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const user: any = await firstValueFrom(
      this.client.send({ cmd: ECmdNames.Login }, loginUserDto),
    );

    const payload = {
      username: user.username,
      sub: user._id,
      email: user.email,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async getUsers() {
    return this.client.send({ cmd: ECmdNames.GetUsers }, {});
  }
}
