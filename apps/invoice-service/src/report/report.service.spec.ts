// import { Invoice } from './../schema/invoice.schema';
// import { Test, TestingModule } from '@nestjs/testing';
// import { ReportService } from './report.service';
// import { InvoiceServiceService } from '../invoice-service.service';
// import { ClientProxy } from '@nestjs/microservices';
// import { of } from 'rxjs';

// describe('ReportService', () => {
//   let service: ReportService;
//   let invoiceServiceMock: jest.Mocked<InvoiceServiceService>;
//   let rabbitClientMock: jest.Mocked<ClientProxy>;

//   beforeEach(async () => {
//     invoiceServiceMock = {
//       findAllForToday: jest.fn(),
//     } as any;

//     rabbitClientMock = {
//       emit: jest.fn().mockReturnValue(of(true)),
//     } as any;

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ReportService,
//         { provide: InvoiceServiceService, useValue: invoiceServiceMock },
//         { provide: 'RABBITMQ_SERVICE', useValue: rabbitClientMock },
//       ],
//     }).compile();

//     service = module.get<ReportService>(ReportService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('generateDailySalesReport', () => {
//     it('should fetch invoices, calculate total sales, generate item summary, and emit report', async () => {
//       // Mock invoices data with full structure
//       const invoices: Invoice[] = [
//         {
//           customer: 'Customer A',
//           amount: 100,
//           reference: 'INV001',
//           date: new Date(),
//           items: [
//             { sku: 'item1', qt: 2 },
//             { sku: 'item2', qt: 3 },
//           ],
//         },
//         {
//           customer: 'Customer B',
//           amount: 200,
//           reference: 'INV002',
//           date: new Date(),
//           items: [
//             { sku: 'item1', qt: 1 },
//             { sku: 'item3', qt: 5 },
//           ],
//         },
//       ] as any; // Explicitly cast the object to match the `Invoice` type
      
//       invoiceServiceMock.findAllForToday.mockResolvedValue(invoices);

//       await service.generateDailySalesReport();

//       // Check if invoices were fetched
//       expect(invoiceServiceMock.findAllForToday).toHaveBeenCalledTimes(1);

//       // Check if the total sales and item summary were calculated correctly
//       const expectedReport = {
//         totalSales: 300, // 100 + 200
//         itemSummary: {
//           item1: 3, // 2 + 1
//           item2: 3, // 3
//           item3: 5, // 5
//         },
//       };

//       // Check if report is emitted
//       expect(rabbitClientMock.emit).toHaveBeenCalledWith(
//         'daily_sales_report',
//         expectedReport,
//       );
//     });

//     it('should handle an empty list of invoices', async () => {
//       // Mock no invoices
//       invoiceServiceMock.findAllForToday.mockResolvedValue([]);

//       await service.generateDailySalesReport();

//       // Check if the total sales and item summary are both empty
//       const expectedReport = {
//         totalSales: 0,
//         itemSummary: {},
//       };

//       expect(rabbitClientMock.emit).toHaveBeenCalledWith(
//         'daily_sales_report',
//         expectedReport,
//       );
//     });
//   });
// });


import { Invoice } from './../schema/invoice.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { InvoiceServiceService } from '../invoice-service.service';
import { RabbitMQService } from '../../../../libs/common/src';

describe('ReportService', () => {
  let service: ReportService;
  let invoiceServiceMock: jest.Mocked<InvoiceServiceService>;
  let rabbitMQServiceMock: jest.Mocked<RabbitMQService>; // Mock RabbitMQService

  beforeEach(async () => {
    // Mock the InvoiceServiceService
    invoiceServiceMock = {
      findAllForToday: jest.fn(),
    } as any;

    // Mock the RabbitMQService with the correct method
    rabbitMQServiceMock = {
      publish: jest.fn().mockResolvedValue(true), // Mocking the 'publish' method
      consume: jest.fn(), // Mock other methods if necessary
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: InvoiceServiceService, useValue: invoiceServiceMock },
        { provide: RabbitMQService, useValue: rabbitMQServiceMock }, // Provide RabbitMQService with the mock
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateDailySalesReport', () => {
    it('should fetch invoices, calculate total sales, generate item summary, and publish report', async () => {
      // Mock invoices data with full structure
      const invoices: Invoice[] = [
        {
          customer: 'Customer A',
          amount: 100,
          reference: 'INV001',
          date: new Date(),
          items: [
            { sku: 'item1', qt: 2 },
            { sku: 'item2', qt: 3 },
          ],
        },
        {
          customer: 'Customer B',
          amount: 200,
          reference: 'INV002',
          date: new Date(),
          items: [
            { sku: 'item1', qt: 1 },
            { sku: 'item3', qt: 5 },
          ],
        },
      ] as any; // Explicitly cast the object to match the `Invoice` type

      invoiceServiceMock.findAllForToday.mockResolvedValue(invoices);

      await service.generateDailySalesReport();

      // Check if invoices were fetched
      expect(invoiceServiceMock.findAllForToday).toHaveBeenCalledTimes(1);

      // Check if the total sales and item summary were calculated correctly
      const expectedReport = {
        totalSales: 300, // 100 + 200
        itemSummary: {
          item1: 3, // 2 + 1
          item2: 3, // 3
          item3: 5, // 5
        },
      };

      // Check if report is published
      expect(rabbitMQServiceMock.publish).toHaveBeenCalledWith(
        'daily_sales_report',
        expectedReport,
      );
    });

    it('should handle an empty list of invoices', async () => {
      // Mock no invoices
      invoiceServiceMock.findAllForToday.mockResolvedValue([]);

      await service.generateDailySalesReport();

      // Check if the total sales and item summary are both empty
      const expectedReport = {
        totalSales: 0,
        itemSummary: {},
      };

      expect(rabbitMQServiceMock.publish).toHaveBeenCalledWith(
        'daily_sales_report',
        expectedReport,
      );
    });
  });
});
