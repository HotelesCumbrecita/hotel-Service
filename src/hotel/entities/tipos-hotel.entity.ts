import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('tipos_hoteles')
export class TipoHotel {
  @PrimaryGeneratedColumn()
  idTipoHotel: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Hotel, (hotel) => hotel.tipoHotel)
  hotel: Hotel[];
}
