import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateHabitacionDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcionCorta: string;

  @IsNotEmpty()
  @IsString()
  descripcionLarga: string;

  @IsNotEmpty()
  @IsInt()
  tipoHabitacionId: number;

  @IsNotEmpty()
  @IsInt()
  capacidad: number;

  @IsNotEmpty()
  @IsInt()
  cantidad: number;

  @IsNotEmpty()
  @IsBoolean()
  activo: boolean;

  @IsNotEmpty()
  @IsBoolean()
  disponibilidad: boolean;

  @IsNotEmpty()
  @IsInt()
  hotelId: number;

  @IsNotEmpty()
  @IsInt()
  usuarioCreador: number;

  @IsOptional()
  @IsArray()
  fotos: { url: string; descripcion?: string }[];

  @IsOptional()
  @IsArray()
  serviciosEspecificos: { nombre: string; descripcion: string }[];
}
