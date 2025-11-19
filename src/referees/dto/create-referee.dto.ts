import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateRefereeDto {
  @ApiProperty({ example: 'Jean Martin', description: 'Nom de l\'arbitre' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+33123456789', description: 'Numéro de téléphone' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'jean.martin@example.com', description: 'Email de l\'arbitre' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

