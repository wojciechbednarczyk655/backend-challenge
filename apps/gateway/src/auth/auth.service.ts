import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';

import { CreateUserDto, LoginUserDto } from '@common/dtos/create-user.dto';
import { ECmdNames } from '@common/enums/cmd-name.enum';
import { firstValueFrom } from 'rxjs';
import { UserRto } from '@common/dtos/user.rto';

// Interface for user objects returned from the authentication microservice
interface UserFromMicroservice {
  _id: string;
  username: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserRto> {
    const user: UserFromMicroservice = await firstValueFrom(
      this.client.send({ cmd: ECmdNames.Register }, createUserDto),
    );

    return { id: user._id, username: user.username, email: user.email };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const user: UserFromMicroservice = await firstValueFrom(
      this.client.send({ cmd: ECmdNames.Login }, loginUserDto),
    );
    const payload = {
      username: user.username,
      sub: user._id,
      email: user.email,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async getUsers(): Promise<UserRto[]> {
    const users: UserFromMicroservice[] = await firstValueFrom(
      this.client.send({ cmd: ECmdNames.GetUsers }, {}),
    );

    return users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
    }));
  }
}
