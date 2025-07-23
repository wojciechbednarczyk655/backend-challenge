import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({
              id: '1',
              username: 'test',
              email: 'test@example.com',
            }),
            getUsers: jest
              .fn()
              .mockResolvedValue([
                { id: '1', username: 'test', email: 'test@example.com' },
              ]),
          },
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
    const dto = {
      username: 'test',
      password: 'password123',
      email: 'test@example.com',
    };
    expect(await controller.register(dto)).toEqual({
      id: '1',
      username: 'test',
      email: 'test@example.com',
    });
  });
});
