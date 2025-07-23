import { Test, TestingModule } from '@nestjs/testing';

import { UserRto } from '@common/dtos/user.rto';

import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { LoggingService } from '@core/logging/logging.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const user: UserRto = {
    id: '1',
    username: 'test',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(user),
            login: jest.fn().mockResolvedValue({ access_token: 'jwt.token' }),
            getUsers: jest.fn().mockResolvedValue([user]),
          },
        },
        {
          provide: LoggingService,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = { username: 'test', password: 'pw', email: 'test@example.com' };
    expect(await controller.register(dto)).toEqual(user);
  });

  it('should login and return JWT', async () => {
    const dto = { username: 'test', password: 'pw' };
    expect(await controller.login(dto)).toEqual({ access_token: 'jwt.token' });
  });

  it('should get users', async () => {
    expect(await controller.getUsers({ username: 'test' })).toEqual([user]);
  });
});
