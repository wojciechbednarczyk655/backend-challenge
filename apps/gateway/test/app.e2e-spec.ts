import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { GatewayModule } from '../src/gateway.module';

describe('Gateway e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GatewayModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  it('/auth/register (POST) - success', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      username: 'test',
      password: 'password123',
      email: 'test@example.com',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username');
    expect(res.body).toHaveProperty('email');
  });

  it('/auth/login (POST) - success', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      username: 'test2',
      password: 'password123',
      email: 'test2@example.com',
    });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test2', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('access_token');
  });

  it('/auth/users (GET) - unauthorized', async () => {
    const res = await request(app.getHttpServer()).get('/auth/users');
    expect(res.status).toBe(401);
  });
});
