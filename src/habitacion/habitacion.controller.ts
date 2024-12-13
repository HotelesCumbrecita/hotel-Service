import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HabitacionService } from './habitacion.service';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { CreateFotoHabitacionDto } from './dto/create-foto-habitacion.dto';
import { CreateServicioHabitacionDto } from './dto/create-servicio-habitacion.dto';
import { CreateTipoHabitacionDto } from './dto/create-tipo-habitacion.dto';

@Controller()
export class HabitacionController {
  constructor(private readonly habitacionService: HabitacionService) {}

  @MessagePattern({ cmd: 'create_habitacion' })
  async create(@Payload() createHabitacionDto: CreateHabitacionDto) {
    return this.habitacionService.create(createHabitacionDto);
  }

  @MessagePattern({ cmd: 'find_all_habitaciones_by_hotel' })
  async findAllByHotel(
    @Payload() payload: { hotelId: number; paginationDto: PaginationDto },
  ) {
    return this.habitacionService.findAllByHotel(
      payload.hotelId,
      payload.paginationDto,
    );
  }

  @MessagePattern({ cmd: 'find_one_habitacion' })
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.habitacionService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_all_habitaciones_by_tipo' })
  async findAllByTipoHabitacion(
    @Payload()
    payload: {
      tipoHabitacionId: number;
      paginationDto: PaginationDto;
    },
  ) {
    return this.habitacionService.findAllByTipoHabitacion(
      payload.tipoHabitacionId,
      payload.paginationDto,
    );
  }

  @MessagePattern({ cmd: 'find_all_habitaciones_by_servicio' })
  async findAllByServicio(
    @Payload() payload: { servicioId: number; paginationDto: PaginationDto },
  ) {
    return this.habitacionService.findAllByServicio(
      payload.servicioId,
      payload.paginationDto,
    );
  }

  @MessagePattern({ cmd: 'create_tipo_habitacion' })
  async createTipoHabitacion(
    @Payload() createTipoHabitacionDto: CreateTipoHabitacionDto,
  ) {
    return this.habitacionService.createTipoHabitacion(createTipoHabitacionDto);
  }

  @MessagePattern({ cmd: 'find_all_tipos_habitacion' })
  async findAllTiposHabitacion() {
    return this.habitacionService.findAllTiposHabitacion();
  }

  @MessagePattern({ cmd: 'remove_tipo_habitacion' })
  async removeTipoHabitacion(@Payload('id', ParseIntPipe) id: number) {
    return this.habitacionService.removeTipoHabitacion(id);
  }

  @MessagePattern({ cmd: 'create_servicio_habitacion' })
  async createServicioHabitacion(
    @Payload() createServicioHabitacionDto: CreateServicioHabitacionDto,
  ) {
    return this.habitacionService.createServicioHabitacion(
      createServicioHabitacionDto,
    );
  }

  @MessagePattern({ cmd: 'find_all_servicios_habitacion' })
  async findAllServiciosHabitacion() {
    return this.habitacionService.findAllServiciosHabitacion();
  }

  @MessagePattern({ cmd: 'remove_servicio_habitacion' })
  async removeServicioHabitacion(@Payload('id', ParseIntPipe) id: number) {
    return this.habitacionService.removeServicioHabitacion(id);
  }

  @MessagePattern({ cmd: 'create_foto_habitacion' })
  async createFotoHabitacion(
    @Payload() createFotoHabitacionDto: CreateFotoHabitacionDto,
  ) {
    return this.habitacionService.createFotoHabitacion(createFotoHabitacionDto);
  }

  @MessagePattern({ cmd: 'find_all_fotos_habitacion' })
  async findAllFotosHabitacion(
    @Payload('habitacionId', ParseIntPipe) habitacionId: number,
  ) {
    return this.habitacionService.findAllFotosHabitacion(habitacionId);
  }

  @MessagePattern({ cmd: 'remove_foto_habitacion' })
  async removeFotoHabitacion(@Payload('id', ParseIntPipe) id: number) {
    return this.habitacionService.removeFotoHabitacion(id);
  }

  @MessagePattern({ cmd: 'update_habitacion' })
  async update(
    @Payload()
    payload: {
      id: number;
      updateHabitacionDto: UpdateHabitacionDto;
    },
  ) {
    return this.habitacionService.update(
      payload.id,
      payload.updateHabitacionDto,
    );
  }

  @MessagePattern({ cmd: 'remove_habitacion' })
  async remove(@Payload() id: number) {
    return this.habitacionService.remove(id);
  }

  @MessagePattern({ cmd: 'calcular_precio' })
  async calcularPrecio(
    @Payload()
    payload: {
      habitacionId: number;
      fechaInicio: Date;
      fechaFin: Date;
    },
  ) {
    return this.habitacionService.calcularPrecio(
      payload.habitacionId,
      payload.fechaInicio,
      payload.fechaFin,
    );
  }

  /*@MessagePattern({ cmd: 'verificar_disponibilidad' })
  async verificarDisponibilidad(
    @Payload()
    payload: {
      habitacionId: number;
      fechaInicio: Date;
      fechaFin: Date;
    },
  ) {
    return this.habitacionService.verificarDisponibilidad(
      payload.habitacionId,
      payload.fechaInicio,
      payload.fechaFin,
    );
  }*/
}
