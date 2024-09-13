// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { EmailSenderModule } from './../src/email-sender.module';

// describe('EmailSenderController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [EmailSenderModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'apps/invoice-daily-sales-report/src/app.module';
import { EmailSenderService } from '../src/email-sender.service';

describe('EmailSender E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should send an email report successfully', async () => {
    const report = {
      totalSales: 100,
      itemSummary: {
        'item1': 10,
        'item2': 5,
      },
    };

    const response = await request(app.getHttpServer())
      .post('/send-email-report') 
      .send(report)
      .expect(201); 

    expect(response.body).toEqual({
      message: 'Sales report sent via email.',
    });
  });

  it('should return an error if sending email fails', async () => {
    const report = {
      totalSales: 100,
      itemSummary: {
        'item1': 10,
        'item2': 5,
      },
    };

    // Simulate a scenario where sending the email fails
    jest.spyOn(EmailSenderService.prototype, 'sendEmailReport').mockImplementationOnce(() => {
      throw new Error('Email service is down. Please try again later');
    });

    const response = await request(app.getHttpServer())
      .post('/send-email-report')
      .send(report)
      .expect(500); 

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Internal server error',
    });
  });
});
