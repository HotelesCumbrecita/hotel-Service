import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { Hotel } from './entities/hotel.entity';
import { ServicioHotel } from './entities/servicios-hotel.entity';
import { FotoHotel } from './entities/fotos-hotel.entity';
import { TipoHotel } from './entities/tipos-hotel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel, ServicioHotel, FotoHotel, TipoHotel]),
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
