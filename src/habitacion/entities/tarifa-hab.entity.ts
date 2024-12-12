import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Habitacion } from './habitacion.entity';

@Entity('tarifas_habitaciones')
export class TarifaHabitacion {
  @PrimaryGeneratedColumn()
  tarifaHabitacionId: number;

  @ManyToOne(() => Habitacion, (habitacion) => habitacion.tarifas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'habitacionId' })
  habitacion: Habitacion;

  @Column()
  habitacionId: number;

  /**
   * Precio base o total a aplicar. Este puede sustituir o sumar
   * (dependiendo de la lógica en el servicio) al precio base de la habitación.
   * Podrías usar un decimal con precisión.
   */
  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  /**
   * Campo opcional para días específicos de la semana.
   * Valor esperado: 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
   * Si es null, no aplica restricción por día de la semana.
   */
  @Column({ type: 'int', nullable: true })
  diaSemana: number;

  /**
   * Campos para temporada o rango de fechas.
   * Si se establece un rango, la tarifa aplica sólo dentro de esas fechas.
   * Si es null, no se filtra por rango de fechas.
   */
  @Column({ type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFin: Date;

  /**
   * Campo opcional para definir una temporada o evento especial.
   * Ej: 'verano', 'feriado', 'festival', etc.
   */
  @Column({ nullable: true })
  temporada: string;

  /**
   * Campo de prioridad para resolver conflictos.
   * Un número menor indica mayor prioridad. Ej:
   * 1 = Feriado/evento especial
   * 2 = Temporada alta
   * 3 = Día de la semana
   * 4 = Base
   */
  @Column({ type: 'int', default: 4 })
  prioridad: number;
}
