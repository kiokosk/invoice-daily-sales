
import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { InvoiceServiceService } from './invoice-service.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto/create-invoice.dto';

@Controller('invoices')
export class InvoiceServiceController {
  constructor(private readonly invoiceService: InvoiceServiceService) {}

  @Post()
  createInvoice(@Body() invoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(invoiceDto);
  }

  @Get(':id')
  getInvoiceById(@Param('id') id: string) {
    return this.invoiceService.findById(id);
  }

  @Get()
  getAllInvoices(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {

    return this.invoiceService.findAll(startDate, endDate);
  }
}

