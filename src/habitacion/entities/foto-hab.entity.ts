import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habitacion } from './habitacion.entity';

@Entity('fotos_habitaciones')
export class FotoHabitacion {
  @PrimaryGeneratedColumn()
  idFotoHabitacion: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Habitacion, (habitacion) => habitacion.fotos)
  @JoinColumn({ name: 'habitacionId' })
  habitacion: Habitacion;

  @Column()
  habitacionId: number;
}
