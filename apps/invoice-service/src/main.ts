import { NestFactory } from '@nestjs/core';
import { InvoiceServiceModule } from './invoice-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InvoiceServiceModule);
  await app.listen(3000);
}
bootstrap();
