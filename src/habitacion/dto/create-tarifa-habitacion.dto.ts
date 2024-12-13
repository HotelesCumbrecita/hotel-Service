import { IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTarifaHabitacionDto {
  @IsDecimal()
  precio: number;

  @IsOptional()
  @IsInt()
  diaSemana?: number;

  @IsOptional()
  @IsString()
  fechaInicio?: Date;

  @IsOptional()
  @IsString()
  fechaFin?: Date;

  @IsOptional()
  @IsString()
  temporada?: string;

  @IsOptional()
  @IsInt()
  prioridad?: number;
}
