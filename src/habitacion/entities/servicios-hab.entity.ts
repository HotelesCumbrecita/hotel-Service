import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habitacion } from './habitacion.entity';

@Entity('servicios_habitaciones')
export class ServicioHabitacion {
  @PrimaryGeneratedColumn()
  idServicioHabitacion: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => Habitacion, (habitacion) => habitacion.serviciosEspecificos)
  @JoinColumn({ name: 'habitacionId' })
  habitacion: Habitacion;

  @Column()
  habitacionId: number;

  @Column({ default: true })
  activo: boolean;
}
