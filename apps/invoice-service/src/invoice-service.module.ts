
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceServiceController } from './invoice-service.controller';
import { InvoiceServiceService } from './invoice-service.service';
import { Invoice, InvoiceSchema } from './schema/invoice.schema'; 
import { ReportService } from './report/report.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]), 
  ],
  controllers: [InvoiceServiceController],
  providers: [InvoiceServiceService, ReportService],
  exports: [InvoiceServiceModule],
  
})
export class InvoiceServiceModule {}

