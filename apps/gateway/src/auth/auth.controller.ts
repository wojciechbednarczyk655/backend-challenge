import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CreateUserDto, LoginUserDto } from '@common/dtos/create-user.dto';
import { UserRto } from '@common/dtos/user.rto';

import { EFormType } from '@common/enums/form-type.enum';
import { LoggingService } from '@core/logging/logging.service';

import { EApiEndpointNames } from '../common/enums/api-endpoint-name.enum';
import { EApiTagNames } from '../common/enums/api-tag-name.enum';
import { EControllerNames } from '../common/enums/controller-name.enum';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller(EControllerNames.Auth)
@ApiTags(EApiTagNames.Auth)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggingService,
  ) {}

  @Post(EApiEndpointNames.POSTRegister)
  @ApiConsumes(EFormType.UrlEncoded, EFormType.Json)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered', type: UserRto })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserRto> {
    this.logger.log(`Register attempt for username: ${createUserDto.username}`);
    const result = await this.authService.register(createUserDto);
    this.logger.log(`User registered: ${createUserDto.username}`);
    return result;
  }

  @Post(EApiEndpointNames.POSTLogin)
  @ApiConsumes(EFormType.UrlEncoded, EFormType.Json)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'JWT token',
    schema: { example: { access_token: 'jwt.token.here' } },
  })
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    this.logger.log(`Login attempt for username: ${loginUserDto.username}`);
    try {
      const result = await this.authService.login(loginUserDto);
      this.logger.log(
        `Login successful for username: ${loginUserDto.username}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Login failed for username: ${loginUserDto.username}`);
      throw err;
    }
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get(EApiEndpointNames.GETUsers)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserRto] })
  async getUsers(@CurrentUser() user: any): Promise<UserRto[]> {
    this.logger.log(`User list requested by: ${user?.username}`);
    return this.authService.getUsers();
  }
}
