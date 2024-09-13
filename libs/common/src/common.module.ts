
import { Module } from '@nestjs/common';
import { RabbitMqModule } from './rabbitmq.module';  

@Module({
  imports: [RabbitMqModule],
  exports: [RabbitMqModule],
})
export class CommonModule {}

