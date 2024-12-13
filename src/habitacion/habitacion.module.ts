import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitacionService } from './habitacion.service';
import { HabitacionController } from './habitacion.controller';
import { Habitacion } from './entities/habitacion.entity';
import { ServicioHabitacion } from './entities/servicios-hab.entity';
import { FotoHabitacion } from './entities/foto-hab.entity';
import { TipoHabitacion } from './entities/tipo-hab.entity';
import { TarifaHabitacion } from './entities/tarifa-hab.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Habitacion,
      ServicioHabitacion,
      FotoHabitacion,
      TipoHabitacion,
      TarifaHabitacion,
    ]),
  ],
  controllers: [HabitacionController],
  providers: [HabitacionService],
})
export class HabitacionModule {}
