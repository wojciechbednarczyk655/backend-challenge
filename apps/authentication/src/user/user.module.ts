import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggingModule } from '@core/logging/logging.module';

import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    LoggingModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
