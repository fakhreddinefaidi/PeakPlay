import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsDate, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from './create-user.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Wassim', description: 'Nouveau prénom' })
  @IsString()
  @IsOptional()
  prenom?: string;

  @ApiPropertyOptional({ example: 'Abdelli', description: 'Nouveau nom' })
  @IsString()
  @IsOptional()
  nom?: string;

  @ApiPropertyOptional({ example: 'wassimd@test.com', description: 'Nouvel email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '2000-01-01',
    description: 'Nouvelle date de naissance (format YYYY-MM-DD)',
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  age?: Date;

  @ApiPropertyOptional({ example: 987654321, description: 'Nouveau numéro de téléphone' })
  @IsNumber()
  @IsOptional()
  tel?: number;

  @ApiPropertyOptional({ example: '654321', description: 'Nouveau mot de passe' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'ARBITRE',
    enum: UserRole,
    enumName: 'UserRole',
    description: 'Nouveau rôle attribué. Valeurs acceptées: JOUEUR, ACADEMY, ARBITRE',
  })
  @IsEnum(UserRole, { 
    message: 'role must be one of the following values: JOUEUR, ACADEMY, ARBITRE' 
  })
  @IsOptional()
  role?: UserRole | string;
}
