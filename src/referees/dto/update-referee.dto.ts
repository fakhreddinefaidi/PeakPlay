import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateRefereeDto {
  @ApiPropertyOptional({ example: 'Jean Martin', description: 'Nom de l\'arbitre' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '+33123456789', description: 'Numéro de téléphone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'jean.martin@example.com', description: 'Email de l\'arbitre' })
  @IsEmail()
  @IsOptional()
  email?: string;
}

