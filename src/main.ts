import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from 'config';
import { RpcExceptionFilter } from 'common/filters/rpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main');

  // Crear la microservicio con configuración de NATS
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers, // Direcciones de los servidores NATS
      },
    },
  );

  // Configurar validaciones globales para los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina las propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza errores si hay propiedades no permitidas
    }),
  );

  // Registrar el filtro global de excepciones
  app.useGlobalFilters(new RpcExceptionFilter());

  // Iniciar la aplicación y registrar un mensaje en el logger
  await app.listen();
  logger.log(
    `Hotel-Service Microservice is running using NATS on: ${envs.natsServers.join(', ')}`,
  );
}
bootstrap();
