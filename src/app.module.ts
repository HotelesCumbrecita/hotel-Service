import { Module } from '@nestjs/common';
import { HabitacionModule } from './habitacion/habitacion.module';
import { HotelModule } from './hotel/hotel.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from 'config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el módulo de configuración esté disponible globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    HotelModule,
    HabitacionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
