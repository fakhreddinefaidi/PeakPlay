import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateTournamentDto {
  @ApiProperty({ example: 'Tournoi de Printemps 2024', description: 'Nom du tournoi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'U12', description: 'Catégorie d\'âge' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'ELIMINATION', enum: ['ELIMINATION', 'POINTS'], description: 'Type de tournoi' })
  @IsEnum(['ELIMINATION', 'POINTS'])
  @IsNotEmpty()
  type: 'ELIMINATION' | 'POINTS';

  @ApiProperty({ example: 16, description: 'Nombre maximum d\'équipes' })
  @IsNumber()
  @Min(2)
  maxTeams: number;

  @ApiProperty({ example: '2024-05-01T10:00:00Z', description: 'Date de début' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2024-05-05T18:00:00Z', description: 'Date de fin' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: 'Stade Municipal, Paris', description: 'Lieu du tournoi' })
  @IsString()
  @IsNotEmpty()
  location: string;
}

