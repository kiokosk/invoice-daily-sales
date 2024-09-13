import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderService } from './email-sender.service';
import * as nodemailer from 'nodemailer';

// Mocking the nodemailer module
jest.mock('nodemailer');

describe('EmailSenderService', () => {
  let service: EmailSenderService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    // Mock transporter
    sendMailMock = jest.fn().mockResolvedValue('Email sent');

    const createTransportMock = nodemailer.createTransport as jest.Mock;
    createTransportMock.mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSenderService],
    }).compile();

    service = module.get<EmailSenderService>(EmailSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmailReport', () => {
    it('should send an email with the report', async () => {
      // Prepare mock report data
      const mockReport = {
        totalSales: 300,
        itemSummary: {
          item1: 3,
          item2: 5,
        },
      };

      // Call the sendEmailReport method
      await service.sendEmailReport(mockReport);

      // Check that sendMail was called with the correct mail options
      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: 'Daily Sales Report',
        text: `Total Sales: 300\n\nItem Summary: {"item1":3,"item2":5}`,
      });
    });

    it('should log an error if email sending fails', async () => {
      // Simulate an error in sendMail
      sendMailMock.mockRejectedValueOnce(new Error('Email sending failed'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockReport = {
        totalSales: 100,
        itemSummary: {
          item1: 1,
        },
      };

      // Call the method and expect an error to be logged
      await service.sendEmailReport(mockReport);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error sending email:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
