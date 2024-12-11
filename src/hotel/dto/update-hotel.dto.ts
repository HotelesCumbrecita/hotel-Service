import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsMobilePhone,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateHotelDto {
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
  tipoHotelId?: number;

  @IsOptional()
  @IsString()
  cuit?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsMobilePhone('es-AR')
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  documentoInscripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  cantidadHabitaciones?: number;

  @IsOptional()
  @IsArray()
  fotos?: { url: string; descripcion?: string }[];

  @IsOptional()
  @IsArray()
  serviciosGenerales?: { nombre: string; descripcion: string }[];
}
