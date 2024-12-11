import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateHabitacionDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcionCorta?: string;

  @IsOptional()
  @IsString()
  descripcionLarga?: string;

  @IsOptional()
  @IsInt()
  tipoHabitacionId?: number;

  @IsOptional()
  @IsInt()
  capacidad?: number;

  @IsOptional()
  @IsInt()
  cantidad?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsBoolean()
  disponibilidad?: boolean;

  @IsOptional()
  @IsInt()
  hotelId?: number;

  @IsOptional()
  @IsInt()
  usuarioCreador?: number;

  @IsOptional()
  @IsArray()
  fotos?: { url: string; descripcion?: string }[];

  @IsOptional()
  @IsArray()
  serviciosEspecificos?: { nombre: string; descripcion: string }[];
}
