
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { Response } from 'express';

@Controller('email')
export class EmailSenderController {
  constructor(private readonly emailService: EmailSenderService) {}

  @Get('send-sales-report')
  async sendSalesReport(@Res() res: Response) {
    try {
      const report = {
        totalSales: 1500,
        itemSummary: {
          'item123': 10,
          'item456': 5,
        },
      };

      await this.emailService.sendEmailReport(report);
      return res.status(HttpStatus.OK).json({
        message: 'Sales report sent via email successfully!',
      });
    } catch (error) {
      console.error('Error in controller:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error sending email',
        error: error.message,
      });
    }
  }
}


