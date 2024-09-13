

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schema/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto/create-invoice.dto';

@Injectable()
export class InvoiceServiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<Invoice>) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }

  async findById(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }

  async findAll(startDate?: string, endDate?: string): Promise<Invoice[]> {
    const filter: any = {};
//start date filter
    if (startDate) {
      filter.date = { ...filter.date, $gte: new Date(startDate) }; 
    }
// end date filter
    if (endDate) {
      filter.date = { ...filter.date, $lte: new Date(endDate) }; 
    }
// invoices within the range
    return this.invoiceModel.find(filter).exec(); 
  }

  async findAllForToday(): Promise<Invoice[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return this.invoiceModel
      .find({
        date: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      })
      .exec();
  }
}

