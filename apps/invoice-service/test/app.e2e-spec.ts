import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import { InvoiceServiceModule } from '../src/invoice-service.module';
import { InvoiceServiceModule } from 'apps/invoice-service/src/invoice-service.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('InvoiceService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        InvoiceServiceModule,
        MongooseModule.forRoot(process.env.MONGODB_URI,) 
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST invoices (should create an invoice)', () => {
    return request(app.getHttpServer())
      .post('/invoices')
      .send({
        customer: 'Stephen Kioko',
        amount: 250.75,
        reference: 'INV-2024-001',
        date: '2024-09-05T12:30:00Z',
        items: [
          { sku: 'ITEM-001', qt: 3 },
          { sku: 'ITEM-002', qt: 1 },
        ],
      })
      .expect(201);
  }, 50000);
  });
// });
