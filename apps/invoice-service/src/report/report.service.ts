

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceServiceService } from '../invoice-service.service';
import { RabbitMQService } from '../../../../libs/common/src';
// import { ClientProxy } from '@nestjs/microservices';
// import { Inject } from '@nestjs/common';

@Injectable()
export class ReportService {
  constructor(
    private readonly invoiceService: InvoiceServiceService,
    // @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async generateDailySalesReport() {
    const invoices = await this.invoiceService.findAllForToday();
    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

    const itemSummary = invoices.flatMap(invoice => invoice.items)
      .reduce((summary, item) => {
        summary[item.sku] = (summary[item.sku] || 0) + item.qt;
        return summary;
      }, {});

    const report = {
      totalSales,
      itemSummary,
    };
   
    await this.rabbitMQService.publish('daily_sales_report', report);
  }
}

