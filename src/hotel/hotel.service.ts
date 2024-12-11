import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { ServicioHotel } from './entities/servicios-hotel.entity';
import { FotoHotel } from './entities/fotos-hotel.entity';
import { TipoHotel } from './entities/tipos-hotel.entity';
import { CreateTipoHotelDto } from './dto/create-tipo-hotel.dto';
import { CreateFotoHotelDto } from './dto/create-foto-hotel.dto';
import { CreateServicioHotelDto } from './dto/create-servicio-hotel.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(ServicioHotel)
    private servicioHotelRepository: Repository<ServicioHotel>,
    @InjectRepository(FotoHotel)
    private fotoHotelRepository: Repository<FotoHotel>,
    @InjectRepository(TipoHotel)
    private tipoHotelRepository: Repository<TipoHotel>,
  ) {}

  // Método para crear un nuevo hotel
  async create(createHotelDto: CreateHotelDto) {
    try {
      const hotel = this.hotelRepository.create(createHotelDto);
      const savedHotel = await this.hotelRepository.save(hotel);

      // Añadir servicios generales al hotel si se proporcionan
      if (createHotelDto.serviciosGenerales) {
        const servicios = createHotelDto.serviciosGenerales.map((servicioDto) =>
          this.servicioHotelRepository.create({
            nombre: servicioDto.nombre,
            descripcion: servicioDto.descripcion,
            hotelId: savedHotel.idHotel,
          }),
        );
        await this.servicioHotelRepository.save(servicios);
      }

      // Añadir fotos al hotel si se proporcionan
      if (createHotelDto.fotos) {
        const fotos = createHotelDto.fotos.map((fotoDto) =>
          this.fotoHotelRepository.create({
            url: fotoDto.url,
            descripcion: fotoDto.descripcion,
            hotelId: savedHotel.idHotel,
          }),
        );
        await this.fotoHotelRepository.save(fotos);
      }

      return savedHotel;
    } catch (error) {
      throw new RpcException('Error al crear el hotel');
    }
  }

  // Método para obtener un hotel por ID
  async findOne(id: number) {
    try {
      const hotel = await this.hotelRepository.findOne({
        where: { idHotel: id, activo: true },
        relations: ['tipoHotel', 'habitaciones', 'serviciosGenerales', 'fotos'],
      });
      if (!hotel) {
        throw new RpcException('Hotel no encontrado');
      }
      return hotel;
    } catch (error) {
      throw new RpcException('Error al obtener el hotel');
    }
  }

  // Método para obtener todos los hoteles
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.hotelRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: { activo: true },
        relations: ['tipoHotel', 'habitaciones', 'serviciosGenerales', 'fotos'],
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
      throw new RpcException('Error al obtener la lista de hoteles');
    }
  }

  // Método para obtener hoteles con habitaciones disponibles en una fecha determinada
  async findAllWithAvailability(fecha: Date, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.habitaciones', 'habitacion')
        .where('habitacion.disponibilidad = :disponibilidad', {
          disponibilidad: true,
        })
        .andWhere('habitacion.fechaCreacion <= :fecha', { fecha })
        .andWhere('hotel.activo = :activo', { activo: true })
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
      throw new RpcException('Error al obtener hoteles con disponibilidad');
    }
  }

  // Método para obtener hoteles con habitaciones disponibles para una cantidad de personas
  async findAllByCapacity(capacidad: number, paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const [data, total] = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.habitaciones', 'habitacion')
        .where('habitacion.capacidad >= :capacidad', { capacidad })
        .andWhere('hotel.activo = :activo', { activo: true })
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
      throw new RpcException('Error al obtener hoteles por capacidad');
    }
  }

  async createServicioHotel(createServicioHotelDto: CreateServicioHotelDto) {
    try {
      const servicioHotel = this.servicioHotelRepository.create(
        createServicioHotelDto,
      );
      return this.servicioHotelRepository.save(servicioHotel);
    } catch (error) {
      throw new RpcException('Error al crear el servicio del hotel');
    }
  }

  async findAllServiciosHotel() {
    try {
      return this.servicioHotelRepository.find();
    } catch (error) {
      throw new RpcException('Error al obtener los servicios del hotel');
    }
  }

  async removeServicioHotel(id: number) {
    try {
      const servicio = await this.servicioHotelRepository.findOneBy({
        idServicioHotel: id,
      });
      if (!servicio) {
        throw new RpcException('Servicio de hotel no encontrado');
      }
      await this.servicioHotelRepository.update(id, { activo: false });
      return servicio;
    } catch (error) {
      throw new RpcException('Error al eliminar el servicio del hotel');
    }
  }

  async createFotoHotel(createFotoHotelDto: CreateFotoHotelDto) {
    try {
      const fotoHotel = this.fotoHotelRepository.create(createFotoHotelDto);
      return this.fotoHotelRepository.save(fotoHotel);
    } catch (error) {
      throw new RpcException('Error al crear la foto del hotel');
    }
  }

  async findAllFotosHotel(hotelId: number) {
    try {
      return this.fotoHotelRepository.find({ where: { hotelId } });
    } catch (error) {
      throw new RpcException('Error al obtener las fotos del hotel');
    }
  }

  async removeFotoHotel(id: number) {
    try {
      const fotoHotel = await this.fotoHotelRepository.findOneBy({
        idFotoHotel: id,
      });
      if (!fotoHotel) {
        throw new RpcException('Foto del hotel no encontrada');
      }
      await this.fotoHotelRepository.delete(id);
      return { message: 'Foto eliminada con éxito' };
    } catch (error) {
      throw new RpcException('Error al eliminar la foto del hotel');
    }
  }

  async createTipoHotel(createTipoHotelDto: CreateTipoHotelDto) {
    try {
      const tipoHotel = this.tipoHotelRepository.create(createTipoHotelDto);
      return this.tipoHotelRepository.save(tipoHotel);
    } catch (error) {
      throw new RpcException('Error al crear el tipo de hotel');
    }
  }

  async findAllTiposHotel() {
    try {
      return this.tipoHotelRepository.find();
    } catch (error) {
      throw new RpcException('Error al obtener los tipos de hotel');
    }
  }

  async removeTipoHotel(id: number) {
    try {
      const tipoHotel = await this.tipoHotelRepository.findOneBy({
        idTipoHotel: id,
      });
      if (!tipoHotel) {
        throw new RpcException('Tipo de hotel no encontrado');
      }
      await this.tipoHotelRepository.update(id, { activo: false });
      return tipoHotel;
    } catch (error) {
      throw new RpcException('Error al eliminar el tipo de hotel');
    }
  }

  // Método para actualizar un hotel
  async update(id: number, updateHotelDto: UpdateHotelDto) {
    try {
      const hotel = await this.findOne(id);
      if (!hotel) {
        throw new RpcException('Hotel no encontrado');
      }

      await this.hotelRepository.update(id, updateHotelDto);

      // Actualizar servicios generales si se proporcionan
      if (updateHotelDto.serviciosGenerales) {
        await this.servicioHotelRepository.delete({ hotelId: id });
        const servicios = updateHotelDto.serviciosGenerales.map((servicioDto) =>
          this.servicioHotelRepository.create({
            nombre: servicioDto.nombre,
            descripcion: servicioDto.descripcion,
            hotelId: id,
          }),
        );
        await this.servicioHotelRepository.save(servicios);
      }

      // Actualizar fotos si se proporcionan
      if (updateHotelDto.fotos) {
        await this.fotoHotelRepository.delete({ hotelId: id });
        const fotos = updateHotelDto.fotos.map((fotoDto) =>
          this.fotoHotelRepository.create({
            url: fotoDto.url,
            descripcion: fotoDto.descripcion,
            hotelId: id,
          }),
        );
        await this.fotoHotelRepository.save(fotos);
      }

      return this.findOne(id);
    } catch (error) {
      throw new RpcException('Error al actualizar el hotel');
    }
  }

  // Método para eliminar un hotel (baja lógica)
  async remove(id: number) {
    try {
      const hotel = await this.findOne(id);
      if (!hotel) {
        throw new RpcException('Hotel no encontrado');
      }
      await this.hotelRepository.update(id, { activo: false });
      return this.findOne(id);
    } catch (error) {
      throw new RpcException('Error al eliminar el hotel');
    }
  }
}
