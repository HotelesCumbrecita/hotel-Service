import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('fotos_hoteles')
export class FotoHotel {
  @PrimaryGeneratedColumn()
  idFotoHotel: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.fotos)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @Column()
  hotelId: number;
}
