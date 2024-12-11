import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { CreateTipoHotelDto } from './dto/create-tipo-hotel.dto';
import { CreateFotoHotelDto } from './dto/create-foto-hotel.dto';
import { CreateServicioHotelDto } from './dto/create-servicio-hotel.dto';

@Controller()
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @MessagePattern({ cmd: 'create_hotel' })
  async create(@Payload() createHotelDto: CreateHotelDto) {
    return this.hotelService.create(createHotelDto);
  }

  @MessagePattern({ cmd: 'find_one_hotel' })
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.hotelService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_all_hotels' })
  async findAll(@Payload() paginationDto: PaginationDto) {
    return this.hotelService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_all_hotels_with_availability' })
  async findAllWithAvailability(
    @Payload() payload: { fecha: Date; paginationDto: PaginationDto },
  ) {
    return this.hotelService.findAllWithAvailability(
      payload.fecha,
      payload.paginationDto,
    );
  }

  @MessagePattern({ cmd: 'find_all_hotels_by_capacity' })
  async findAllByCapacity(
    @Payload() payload: { capacidad: number; paginationDto: PaginationDto },
  ) {
    return this.hotelService.findAllByCapacity(
      payload.capacidad,
      payload.paginationDto,
    );
  }

  @MessagePattern({ cmd: 'create_servicio_hotel' })
  async createServicioHotel(
    @Payload() createServicioHotelDto: CreateServicioHotelDto,
  ) {
    return this.hotelService.createServicioHotel(createServicioHotelDto);
  }

  @MessagePattern({ cmd: 'find_all_servicios_hotel' })
  async findAllServiciosHotel() {
    return this.hotelService.findAllServiciosHotel();
  }

  @MessagePattern({ cmd: 'remove_servicio_hotel' })
  async removeServicioHotel(@Payload('id', ParseIntPipe) id: number) {
    return this.hotelService.removeServicioHotel(id);
  }

  @MessagePattern({ cmd: 'create_foto_hotel' })
  async createFotoHotel(@Payload() createFotoHotelDto: CreateFotoHotelDto) {
    return this.hotelService.createFotoHotel(createFotoHotelDto);
  }

  @MessagePattern({ cmd: 'find_all_fotos_hotel' })
  async findAllFotosHotel(@Payload('hotelId', ParseIntPipe) hotelId: number) {
    return this.hotelService.findAllFotosHotel(hotelId);
  }

  @MessagePattern({ cmd: 'remove_foto_hotel' })
  async removeFotoHotel(@Payload('id', ParseIntPipe) id: number) {
    return this.hotelService.removeFotoHotel(id);
  }

  @MessagePattern({ cmd: 'create_tipo_hotel' })
  async createTipoHotel(@Payload() createTipoHotelDto: CreateTipoHotelDto) {
    return this.hotelService.createTipoHotel(createTipoHotelDto);
  }

  @MessagePattern({ cmd: 'find_all_tipos_hotel' })
  async findAllTiposHotel() {
    return this.hotelService.findAllTiposHotel();
  }

  @MessagePattern({ cmd: 'remove_tipo_hotel' })
  async removeTipoHotel(@Payload('id', ParseIntPipe) id: number) {
    return this.hotelService.removeTipoHotel(id);
  }

  @MessagePattern({ cmd: 'update_hotel' })
  async update(
    @Payload()
    payload: {
      id: number;
      updateHotelDto: UpdateHotelDto;
    },
  ) {
    return this.hotelService.update(payload.id, payload.updateHotelDto);
  }

  @MessagePattern({ cmd: 'remove_hotel' })
  async remove(@Payload('id', ParseIntPipe) id: number) {
    return this.hotelService.remove(id);
  }
}
