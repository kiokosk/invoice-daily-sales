

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailSenderService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
      },
    });
  }

  async sendEmailReport(report: any) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,  
        to: process.env.RECEIVER_EMAIL,  
        subject: 'Daily Sales Report',
        text: `Total Sales: ${report.totalSales}\n\nItem Summary: ${JSON.stringify(report.itemSummary)}`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Sales report sent via email.');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
