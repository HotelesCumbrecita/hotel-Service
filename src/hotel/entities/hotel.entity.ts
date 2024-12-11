import { Habitacion } from 'src/habitacion/entities/habitacion.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServicioHotel } from './servicios-hotel.entity';
import { FotoHotel } from './fotos-hotel.entity';
import { TipoHotel } from './tipos-hotel.entity';

@Entity('hoteles')
export class Hotel {
  @PrimaryGeneratedColumn()
  idHotel: number;

  @Column()
  usuarioCreador: number;

  @Column()
  nombre: string;

  @Column()
  descripcionCorta: string;

  @Column()
  descripcionLarga: string;

  @ManyToOne(() => TipoHotel, (tipoHotel) => tipoHotel.hotel)
  @JoinColumn({ name: 'tipoHotelId' })
  tipoHotel: TipoHotel;

  @Column()
  tipoHotelId: number;

  @Column()
  cuit: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ default: 0 })
  cantidadHabitaciones: number;

  @Column()
  responsable: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  direccion: string;

  @Column()
  documentoInscripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  fechaModificacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaBaja: Date;

  @OneToMany(() => Habitacion, (habitacion) => habitacion.hotel)
  habitaciones: Habitacion[];

  @OneToMany(() => ServicioHotel, (servicioHotel) => servicioHotel.hotel)
  serviciosGenerales: ServicioHotel[];

  @OneToMany(() => FotoHotel, (fotoHotel) => fotoHotel.hotel)
  fotos: FotoHotel[];
}
