import { InvoiceServiceService } from './invoice-service.service';
import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceServiceController } from './invoice-service.controller';

describe('InvoiceController', () => {
  let invoiceController: InvoiceServiceController;
  let invoiceService: InvoiceServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceServiceController],
      providers: [
        {
          provide: InvoiceServiceService,
          useValue: {
            findAll: jest.fn(() => []), // Mocking findAll method to return an empty array
            findById: jest.fn(id => ({ id, customer: 'Stephen Kioko', amount: 350 })),
            create: jest.fn(dto => ({ ...dto, id: '1' })),
          },
        },
      ],
    }).compile();

    invoiceController = module.get<InvoiceServiceController>(InvoiceServiceController);
    invoiceService = module.get<InvoiceServiceService>(InvoiceServiceService);
  });

  describe('getAllInvoices', () => {
    it('should return an array of invoices', async () => {
      const result = await invoiceController.getAllInvoices();
      expect(result).toEqual([]);
      expect(invoiceService.findAll).toHaveBeenCalled();
    });
  });

  describe('getInvoice', () => {
    it('should return a single invoice by ID', async () => {
      const id = '1';
      const result = await invoiceController.getInvoiceById(id);
      expect(result).toEqual({ id: '1', customer: 'Stephen Kioko', amount: 350 });
      expect(invoiceService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('createInvoice', () => {
    it('should create a new invoice', async () => {
      const createInvoiceDto = { customer: 'Stephen Kioko',
        amount: 350,
        reference: 'INV001/6', 
        date: new Date(),
        items: [{ sku: '3413', qt: 4 }] };
      const result = await invoiceController.createInvoice(createInvoiceDto);
      expect(result).toEqual({ ...createInvoiceDto, id: '1' });
      expect(invoiceService.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });
});
