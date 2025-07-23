import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';

import { LoggingService } from '@core/logging/logging.service';

import { User } from '../src/user/schemas/user.schema';
import { UserService } from '../src/user/user.service';

const mockUser = {
  _id: '1',
  username: 'test',
  password: 'hashedpw',
  email: 'test@example.com',
};

const userModelMock = Object.assign(
  jest.fn().mockImplementation(() => {
    const userInstance = Object.create(mockUser);
    userInstance.save = jest.fn().mockResolvedValue(mockUser);
    return userInstance;
  }),
  {
    findOne: jest.fn(),
    find: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([mockUser]) }),
    save: jest.fn(),
  },
);

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let logger: LoggingService;
  let hashSpy: jest.SpiedFunction<typeof bcrypt.hash>;
  let compareSpy: jest.SpiedFunction<typeof bcrypt.compare>;

  beforeEach(async () => {
    hashSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValue('hashedpw' as unknown as never);
    compareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as unknown as never);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
        {
          provide: LoggingService,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
    logger = module.get<LoggingService>(LoggingService);
  });

  afterEach(() => {
    if (hashSpy) hashSpy.mockRestore();
    if (compareSpy) compareSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      const saveMock = jest.fn().mockResolvedValueOnce(mockUser);
      (model as any).save = saveMock;
      const result = await service.register({
        username: 'test',
        password: 'pw',
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });
    it('should throw on duplicate', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      await expect(
        service.register({
          username: 'test',
          password: 'pw',
          email: 'test@example.com',
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      const result = await service.login({ username: 'test', password: 'pw' });
      expect(result).toEqual(mockUser);
    });
    it('should throw on user not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      await expect(
        service.login({ username: 'notfound', password: 'pw' }),
      ).rejects.toThrow(RpcException);
    });
    it('should throw on invalid password', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false as unknown as never);
      await expect(
        service.login({ username: 'test', password: 'wrong' }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const result = await service.getUsers();
      expect(result).toEqual([mockUser]);
    });
    it('should handle errors', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(() => {
        throw new Error('fail');
      });
      await expect(service.getUsers()).rejects.toThrow(RpcException);
    });
  });
});
