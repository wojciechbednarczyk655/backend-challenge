import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { User } from '../src/user/schemas/user.schema';
import { UserService } from '../src/user/user.service';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            save: jest.fn(),
            find: jest
              .fn()
              .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = {
      username: 'test',
      password: 'password123',
      email: 'test@example.com',
    };
    jest.spyOn(model, 'save').mockResolvedValueOnce(dto);
    expect(await service.register(dto)).toEqual(dto);
  });
});
