import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('servicios_hoteles')
export class ServicioHotel {
  @PrimaryGeneratedColumn()
  idServicioHotel: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.serviciosGenerales)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column()
  hotelId: number;

  @Column({ default: true })
  activo: boolean;
}
