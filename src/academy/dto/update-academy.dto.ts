import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateAcademyDto {
  @ApiPropertyOptional({ example: 'Académie de Football Paris', description: 'Nom de l\'académie' })
  @IsString()
  @IsOptional()
  academyName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png', description: 'URL du logo' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '123 Rue de la République, 75001 Paris', description: 'Adresse' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '+33123456789', description: 'Numéro de téléphone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Jean Dupont', description: 'Nom du responsable' })
  @IsString()
  @IsOptional()
  responsableName?: string;

  @ApiPropertyOptional({ example: ['U10', 'U12', 'U15'], description: 'Catégories d\'âge' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];
}

