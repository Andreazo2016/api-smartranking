import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import * as momentTimeZone from 'moment-timezone';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter());

  //Converter todas as datas para o horário local
  Date.prototype.toJSON = function():any{
    return momentTimeZone(this)
    .tz('America/Sao_paulo')
    .format('DD/MM/YYYY HH:mm:ss')
  }
  await app.listen(3000);
}
bootstrap();
