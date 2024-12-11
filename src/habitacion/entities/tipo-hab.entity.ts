import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Habitacion } from './habitacion.entity';

@Entity('tipos_habitaciones')
export class TipoHabitacion {
  @PrimaryGeneratedColumn()
  idTipoHabitacion: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Habitacion, (habitacion) => habitacion.tipoHabitacion)
  habitaciones: Habitacion[];
}
