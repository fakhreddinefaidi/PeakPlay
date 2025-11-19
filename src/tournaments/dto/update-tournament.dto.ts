import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';

export class UpdateTournamentDto {
  @ApiPropertyOptional({ example: 'Tournoi de Printemps 2024', description: 'Nom du tournoi' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'U12', description: 'Catégorie d\'âge' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'ELIMINATION', enum: ['ELIMINATION', 'POINTS'], description: 'Type de tournoi' })
  @IsEnum(['ELIMINATION', 'POINTS'])
  @IsOptional()
  type?: 'ELIMINATION' | 'POINTS';

  @ApiPropertyOptional({ example: 16, description: 'Nombre maximum d\'équipes' })
  @IsNumber()
  @Min(2)
  @IsOptional()
  maxTeams?: number;

  @ApiPropertyOptional({ example: '2024-05-01T10:00:00Z', description: 'Date de début' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2024-05-05T18:00:00Z', description: 'Date de fin' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ example: 'Stade Municipal, Paris', description: 'Lieu du tournoi' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'ONGOING', enum: ['UPCOMING', 'ONGOING', 'FINISHED'], description: 'Statut du tournoi' })
  @IsEnum(['UPCOMING', 'ONGOING', 'FINISHED'])
  @IsOptional()
  status?: 'UPCOMING' | 'ONGOING' | 'FINISHED';
}

