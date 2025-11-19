import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateTeamDto {
  @ApiPropertyOptional({ example: 'Équipe U12 A', description: 'Nom de l\'équipe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'U12', description: 'Catégorie d\'âge' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'Marc Dubois', description: 'Nom de l\'entraîneur' })
  @IsString()
  @IsOptional()
  coachName?: string;

  @ApiPropertyOptional({ example: 20, description: 'Nombre maximum de joueurs' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxPlayers?: number;
}

