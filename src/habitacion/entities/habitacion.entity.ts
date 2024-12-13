import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { TipoHabitacion } from './tipo-hab.entity';
import { ServicioHabitacion } from './servicios-hab.entity';
import { FotoHabitacion } from './foto-hab.entity';
import { TarifaHabitacion } from './tarifa-hab.entity';

@Entity('habitaciones')
export class Habitacion {
  @PrimaryGeneratedColumn()
  habitacionId: number;

  @Column()
  nombre: string;

  @Column()
  descripcionCorta: string;

  @Column()
  descripcionLarga: string;

  @ManyToOne(
    () => TipoHabitacion,
    (tipoHabitacion) => tipoHabitacion.habitaciones,
  )
  @JoinColumn({ name: 'tipoHabitacionId' })
  tipoHabitacion: TipoHabitacion;

  @Column()
  tipoHabitacionId: number;

  @Column()
  capacidad: number;

  @Column()
  cantidad: number;

  @Column()
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column()
  usuarioCreador: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.habitaciones)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column()
  hotelId: number;

  @OneToMany(
    () => ServicioHabitacion,
    (servicioHabitacion) => servicioHabitacion.habitacion,
  )
  serviciosEspecificos: ServicioHabitacion[];

  @OneToMany(
    () => FotoHabitacion,
    (fotoHabitacion) => fotoHabitacion.habitacion,
  )
  fotos: FotoHabitacion[];

  @OneToMany(
    () => TarifaHabitacion,
    (tarifaHabitacion) => tarifaHabitacion.habitacion,
  )
  tarifas: TarifaHabitacion[];
}
