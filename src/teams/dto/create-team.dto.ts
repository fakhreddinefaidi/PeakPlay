import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Équipe U12 A', description: 'Nom de l\'équipe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'U12', description: 'Catégorie d\'âge' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Marc Dubois', description: 'Nom de l\'entraîneur' })
  @IsString()
  @IsNotEmpty()
  coachName: string;

  @ApiProperty({ example: 20, description: 'Nombre maximum de joueurs', default: 20 })
  @IsNumber()
  @Min(1)
  maxPlayers: number;
}

