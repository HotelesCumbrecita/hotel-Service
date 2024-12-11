import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateHotelDto {
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
  tipoHotelId: number;

  @IsNotEmpty()
  @IsString()
  cuit: string;

  @IsNotEmpty()
  @IsString()
  responsable: string;

  @IsNotEmpty()
  @IsMobilePhone('es-AR')
  telefono: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  documentoInscripcion: string;

  @IsOptional()
  @IsArray()
  fotos: { url: string; descripcion?: string }[];

  @IsNotEmpty()
  @IsArray()
  serviciosGenerales: { nombre: string; descripcion: string }[];
}
