import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pactum from 'pactum';
import { AppModule } from '@project/app.module';
import { PrismaService } from '@project/prisma/prisma.service';
import { SignupDto } from '@project/auth/dto';
import { EditUserDto } from '@project/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    config = app.get(ConfigService);
    prisma = app.get(PrismaService);

    const port = config.get<number>('PORT');

    await app.listen(port);

    await prisma.cleanDb();

    pactum.request.setBaseUrl(`http://localhost:${port}`);

    pactum.handler.addCaptureHandler('auth_token', (ctx) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return ctx.res.json.access_token || '';
    });
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: SignupDto = {
      email: 'test@mail.com',
      passwd: 'pass',
      name: 'test',
    };
    describe('Signup', () => {
      const endpoint = '/auth/signup';

      it('Should throw if email empty', () =>
        pactum
          .spec()
          .post(endpoint)
          .withBody({
            passwd: dto.passwd,
            name: dto.name,
          })
          .expectStatus(HttpStatus.BAD_REQUEST));

      it('Should throw if password empty', () =>
        pactum
          .spec()
          .post(endpoint)
          .withBody({
            passwd: dto.passwd,
            name: dto.name,
          })
          .expectStatus(HttpStatus.BAD_REQUEST));

      it('Should throw if no body provided', () =>
        pactum.spec().post(endpoint).expectStatus(HttpStatus.BAD_REQUEST));

      it('Should signup', () =>
        pactum
          .spec()
          .post(endpoint)
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED));
    });

    describe('SignIn', () => {
      it('Should throw if empty password', () =>
        pactum
          .spec()
          .post('/auth')
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST));

      it('Should throw if empty email', () =>
        pactum
          .spec()
          .post('/auth')
          .withBody({ passwd: dto.passwd })
          .expectStatus(HttpStatus.BAD_REQUEST));

      it('Should throw if no body provided', () =>
        pactum.spec().post('/auth').expectStatus(HttpStatus.BAD_REQUEST));

      it('Should sign in', () =>
        pactum
          .spec()
          .post('/auth')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userToken', '#auth_token'));
    });
  });
  describe('User', () => {
    describe('Get current user', () => {
      it('Should throw unauthorised request', () =>
        pactum.spec().get('/user/me').expectStatus(HttpStatus.UNAUTHORIZED));

      it('Should get current user', () =>
        pactum
          .spec()
          .get('/user/me')
          .withHeaders('Authorization', 'Bearer $S{userToken}')
          .expectStatus(HttpStatus.OK));
    });
    describe('Edit current user', () => {
      it('Should edit user', () => {
        const dto: EditUserDto = { name: 'Vladimir' };

        return pactum
          .spec()
          .patch('/user')
          .withHeaders('Authorization', 'Bearer $S{userToken}')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.name);
      });
    });
  });
  describe('Pot', () => {
    describe('Create post', () => {});
    describe('Get posts', () => {});
    describe('Get post by id', () => {});
    describe('Delete post', () => {});
    describe('Edit post', () => {});
  });
});
