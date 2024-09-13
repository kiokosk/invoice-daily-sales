import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'; 
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceServiceModule } from '../../invoice-service/src/invoice-service.module';
import { EmailSenderModule } from '../../email-sender/src/email-sender.module';


@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true, 
  }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
    }),
    InvoiceServiceModule, 
    EmailSenderModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
