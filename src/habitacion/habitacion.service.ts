import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { Habitacion } from './entities/habitacion.entity';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicioHabitacion } from './entities/servicios-hab.entity';
import { FotoHabitacion } from './entities/foto-hab.entity';
import { PaginationDto } from 'common';
import { CreateFotoHabitacionDto } from './dto/create-foto-habitacion.dto';
import { CreateServicioHabitacionDto } from './dto/create-servicio-habitacion.dto';
import { CreateTipoHabitacionDto } from './dto/create-tipo-habitacion.dto';
import { TipoHabitacion } from './entities/tipo-hab.entity';
import { CreateTarifaHabitacionDto } from './dto/create-tarifa-habitacion.dto';
import { TarifaHabitacion } from './entities/tarifa-hab.entity';

@Injectable()
export class HabitacionService {
  constructor(
    @InjectRepository(Habitacion)
    private habitacionRepository: Repository<Habitacion>,
    @InjectRepository(ServicioHabitacion)
    private servicioHabitacionRepository: Repository<ServicioHabitacion>,
    @InjectRepository(FotoHabitacion)
    private fotoHabitacionRepository: Repository<FotoHabitacion>,
    @InjectRepository(TipoHabitacion)
    private tipoHabitacionRepository: Repository<TipoHabitacion>,
    @InjectRepository(TarifaHabitacion)
    private tarifaHabitacionRepository: Repository<TarifaHabitacion>,
  ) {}

  // Método para crear una nueva habitación
  async create(createHabitacionDto: CreateHabitacionDto) {
    try {
      const habitaciones = [];

      for (let i = 0; i < createHabitacionDto.cantidad; i++) {
        const habitacion = this.habitacionRepository.create({
          nombre: createHabitacionDto.nombre,
          descripcionCorta: createHabitacionDto.descripcionCorta,
          descripcionLarga: createHabitacionDto.descripcionLarga,
          tipoHabitacionId: createHabitacionDto.tipoHabitacionId,
          capacidad: createHabitacionDto.capacidad,
          cantidad: 1, // Cada iteración representa una habitación individual
          activo: createHabitacionDto.activo,
          fechaCreacion: new Date(),
          usuarioCreador: createHabitacionDto.usuarioCreador,
          hotelId: createHabitacionDto.hotelId,
        });

        // Guardar la habitación para obtener su ID
        const savedHabitacion =
          await this.habitacionRepository.save(habitacion);

        // Añadir servicios específicos a la habitación si se proporcionan
        if (createHabitacionDto.serviciosEspecificos) {
          const servicios = createHabitacionDto.serviciosEspecificos.map(
            (servicioDto) =>
              this.servicioHabitacionRepository.create({
                nombre: servicioDto.nombre,
                descripcion: servicioDto.descripcion,
                habitacionId: savedHabitacion.habitacionId,
              }),
          );
          await this.servicioHabitacionRepository.save(servicios);
        }

        // Añadir fotos a la habitación si se proporcionan
        if (createHabitacionDto.fotos) {
          const fotos = createHabitacionDto.fotos.map((fotoDto) =>
            this.fotoHabitacionRepository.create({
              url: fotoDto.url,
              descripcion: fotoDto.descripcion,
              habitacionId: savedHabitacion.habitacionId,
            }),
          );
          await this.fotoHabitacionRepository.save(fotos);
        }

        // Añadir tarifas a la habitación si se proporcionan
        if (createHabitacionDto.tarifas) {
          const tarifas = createHabitacionDto.tarifas.map((tarifaDto) =>
            this.tarifaHabitacionRepository.create({
              ...tarifaDto,
              habitacionId: savedHabitacion.habitacionId,
            }),
          );
          await this.tarifaHabitacionRepository.save(tarifas);
        }

        habitaciones.push(savedHabitacion);
      }

      return habitaciones;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para obtener todas las habitaciones de un hotel específico
  async findAllByHotel(hotelId: number, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.habitacionRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: { hotelId, activo: true },
        relations: ['tipoHabitacion', 'serviciosEspecificos', 'fotos'],
      });
      const lastPage = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          page,
          lastPage,
        },
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para obtener una habitación por ID
  async findOne(id: number) {
    try {
      return this.habitacionRepository.findOne({
        where: { habitacionId: id, activo: true },
        relations: ['hotel', 'tipoHabitacion', 'serviciosEspecificos', 'fotos'],
      });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para obtener todas las habitaciones por tipo de habitación
  async findAllByTipoHabitacion(
    tipoHabitacionId: number,
    paginationDto: PaginationDto,
  ) {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.habitacionRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: { tipoHabitacionId, activo: true },
      });
      const lastPage = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          page,
          lastPage,
        },
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para obtener habitaciones filtradas por servicios específicos
  async findAllByServicio(servicioId: number, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.habitacionRepository
        .createQueryBuilder('habitacion')
        .leftJoinAndSelect(
          'habitacion.serviciosEspecificos',
          'servicioHabitacion',
        )
        .where('servicioHabitacion.idServicioHabitacion = :servicioId', {
          servicioId,
        })
        .andWhere('habitacion.activo = :activo', { activo: true })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const lastPage = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          page,
          lastPage,
        },
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async createTipoHabitacion(createTipoHabitacionDto: CreateTipoHabitacionDto) {
    try {
      const tipoHabitacion = this.tipoHabitacionRepository.create(
        createTipoHabitacionDto,
      );
      return this.tipoHabitacionRepository.save(tipoHabitacion);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findAllTiposHabitacion() {
    try {
      return this.tipoHabitacionRepository.find();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async removeTipoHabitacion(idTipoHabitacion: number) {
    try {
      await this.tipoHabitacionRepository.update(idTipoHabitacion, {
        activo: false,
      });
      return this.tipoHabitacionRepository.findOneBy({ idTipoHabitacion });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Métodos para servicios de habitación
  async createServicioHabitacion(
    createServicioHabitacionDto: CreateServicioHabitacionDto,
  ) {
    try {
      const servicioHabitacion = this.servicioHabitacionRepository.create(
        createServicioHabitacionDto,
      );
      return this.servicioHabitacionRepository.save(servicioHabitacion);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findAllServiciosHabitacion() {
    try {
      return this.servicioHabitacionRepository.find();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async removeServicioHabitacion(idServicioHabitacion: number) {
    try {
      await this.servicioHabitacionRepository.update(idServicioHabitacion, {
        activo: false,
      });
      return this.servicioHabitacionRepository.findOneBy({
        idServicioHabitacion,
      });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Métodos para fotos de habitación
  async createFotoHabitacion(createFotoHabitacionDto: CreateFotoHabitacionDto) {
    try {
      const fotoHabitacion = this.fotoHabitacionRepository.create(
        createFotoHabitacionDto,
      );
      return this.fotoHabitacionRepository.save(fotoHabitacion);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findAllFotosHabitacion(habitacionId: number) {
    try {
      return this.fotoHabitacionRepository.find({ where: { habitacionId } });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async removeFotoHabitacion(id: number) {
    try {
      return this.fotoHabitacionRepository.delete(id);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para actualizar una habitación
  async update(id: number, updateHabitacionDto: UpdateHabitacionDto) {
    try {
      const habitacion = await this.findOne(id);
      if (!habitacion) {
        throw new Error('Habitación no encontrada');
      }

      await this.habitacionRepository.update(id, updateHabitacionDto);

      // Actualizar servicios específicos si se proporcionan
      if (updateHabitacionDto.serviciosEspecificos) {
        await this.servicioHabitacionRepository.delete({ habitacionId: id });
        const servicios = updateHabitacionDto.serviciosEspecificos.map(
          (servicioDto) =>
            this.servicioHabitacionRepository.create({
              nombre: servicioDto.nombre,
              descripcion: servicioDto.descripcion,
              habitacionId: id,
            }),
        );
        await this.servicioHabitacionRepository.save(servicios);
      }

      // Actualizar fotos si se proporcionan
      if (updateHabitacionDto.fotos) {
        await this.fotoHabitacionRepository.delete({ habitacionId: id });
        const fotos = updateHabitacionDto.fotos.map((fotoDto) =>
          this.fotoHabitacionRepository.create({
            url: fotoDto.url,
            descripcion: fotoDto.descripcion,
            habitacionId: id,
          }),
        );
        await this.fotoHabitacionRepository.save(fotos);
      }

      // Actualizar tarifas si se proporcionan
      if (updateHabitacionDto.tarifas) {
        await this.tarifaHabitacionRepository.delete({ habitacionId: id });
        const tarifas = updateHabitacionDto.tarifas.map((tarifaDto) =>
          this.tarifaHabitacionRepository.create({
            ...tarifaDto,
            habitacionId: id,
          }),
        );
        await this.tarifaHabitacionRepository.save(tarifas);
      }

      return this.habitacionRepository.findOne({
        where: { habitacionId: id },
        relations: ['hotel', 'tipoHabitacion', 'serviciosEspecificos', 'fotos'],
      });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para eliminar una habitación (baja lógica)
  async remove(id: number) {
    try {
      const habitacion = await this.findOne(id);
      if (!habitacion) {
        throw new Error('Habitación no encontrada');
      }
      await this.habitacionRepository.update(id, { activo: false });
      return this.habitacionRepository.findOne({
        where: { habitacionId: id },
      });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para calcular el precio de una habitación
  async calcularPrecio(
    habitacionId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ) {
    try {
      const tarifas = await this.tarifaHabitacionRepository.find({
        where: { habitacionId },
      });

      const fechasReserva = this.getFechasEntre(fechaInicio, fechaFin);
      let precioTotal = 0;

      for (const fecha of fechasReserva) {
        const tarifasAplicables = tarifas.filter((tarifa) => {
          const coincideFecha =
            (!tarifa.fechaInicio || fecha >= tarifa.fechaInicio) &&
            (!tarifa.fechaFin || fecha <= tarifa.fechaFin);

          const coincideDiaSemana =
            tarifa.diaSemana === null || tarifa.diaSemana === fecha.getDay();

          return coincideFecha && coincideDiaSemana;
        });

        // Ordenar por prioridad ascendente (menor número = mayor prioridad)
        tarifasAplicables.sort((a, b) => a.prioridad - b.prioridad);

        const tarifaAplicable = tarifasAplicables[0];

        if (tarifaAplicable) {
          precioTotal += tarifaAplicable.precio;
        } else {
          // Si no hay tarifa aplicable, lanzar error o usar tarifa base
          throw new Error(
            `No hay tarifa disponible para la fecha ${fecha.toISOString()}`,
          );
        }
      }

      return precioTotal;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  // Método para verificar la disponibilidad de una habitación
  /*async verificarDisponibilidad(
    habitacionId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ) {
    try {
      // Como la gestión de reservas está en otro microservicio,
      // asumimos que la habitación está disponible
      return true;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }*/

  // Método auxiliar para obtener las fechas entre dos fechas
  private getFechasEntre(fechaInicio: Date, fechaFin: Date): Date[] {
    const fechas = [];
    let fechaActual = new Date(fechaInicio);

    while (fechaActual <= fechaFin) {
      fechas.push(new Date(fechaActual));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return fechas;
  }
}
