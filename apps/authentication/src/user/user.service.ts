import {
  Injectable,
  // UnauthorizedException,
  // ConflictException,
  // InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto, LoginUserDto } from '@common/dtos/create-user.dto';
import { LoggingService } from '@core/logging/logging.service';

import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly logger: LoggingService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(
        `Register attempt for username: ${createUserDto.username}`,
      );
      const existing = await this.userModel.findOne({
        $or: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      });
      if (existing) {
        this.logger.error(
          `Registration failed: Username or email already exists (${createUserDto.username}, ${createUserDto.email})`,
        );
        throw new RpcException('Username or email already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      let saved: User;
      try {
        const user = new this.userModel({
          ...createUserDto,
          password: hashedPassword,
        });
        saved = await user.save();
      } catch (dbError) {
        this.logger.error(
          `MongoDB error during user save: ${dbError?.message || dbError}`,
        );
        throw new RpcException('Database error during registration');
      }
      if (!saved) {
        this.logger.error('User was not saved to the database');
        throw new RpcException('User was not saved');
      }
      this.logger.log(`User registered: ${createUserDto.username}`);
      return saved;
    } catch (error) {
      this.logger.error(
        `Unexpected error during register for username: ${createUserDto.username}`,
        error.stack || error.message,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(error?.message || 'Internal server error');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      this.logger.log('User list requested');
      return await this.userModel.find().exec();
    } catch (error) {
      this.logger.error(
        `Unexpected error during getUsers`,
        error.stack || error.message,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(error?.message || 'Internal server error');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    try {
      this.logger.log(`Login attempt for username: ${loginUserDto.username}`);
      const user = await this.userModel.findOne({
        username: loginUserDto.username,
      });
      if (!user) {
        this.logger.error(
          `Login failed: User not found (${loginUserDto.username})`,
        );
        throw new RpcException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!isMatch) {
        this.logger.error(
          `Login failed: Invalid password (${loginUserDto.username})`,
        );
        throw new RpcException('Invalid credentials');
      }
      this.logger.log(
        `Login successful for username: ${loginUserDto.username}`,
      );
      return user;
    } catch (error) {
      this.logger.error(
        `Unexpected error during login for username: ${loginUserDto.username}`,
        error.stack || error.message,
      );
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(error?.message || 'Internal server error');
    }
  }
}
