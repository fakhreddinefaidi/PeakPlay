import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@ApiTags('Tournaments')
@ApiBearerAuth('access-token')
@Controller('tournaments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Créer un nouveau tournoi' })
  @ApiResponse({ status: 201, description: 'Tournoi créé avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé : rôle ACADEMY requis.' })
  @ApiResponse({ status: 400, description: 'Erreur de validation.' })
  async create(@Body() createTournamentDto: CreateTournamentDto, @Req() req: any) {
    const academyId = req.user.userId;
    return this.tournamentsService.create(createTournamentDto, academyId);
  }

  @Get()
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer tous les tournois de l\'académie' })
  @ApiQuery({ name: 'status', required: false, enum: ['UPCOMING', 'ONGOING', 'FINISHED'], description: 'Filtrer par statut' })
  @ApiResponse({ status: 200, description: 'Liste des tournois récupérée avec succès.' })
  async findAll(@Query('status') status: string, @Req() req: any) {
    const academyId = req.user.userId;
    return this.tournamentsService.findAll(academyId, status);
  }

  @Get(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer un tournoi par ID' })
  @ApiParam({ name: 'id', description: 'ID du tournoi' })
  @ApiResponse({ status: 200, description: 'Tournoi trouvé.' })
  @ApiResponse({ status: 404, description: 'Tournoi non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const academyId = req.user.userId;
    return this.tournamentsService.findOne(id, academyId);
  }

  @Patch(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Mettre à jour un tournoi' })
  @ApiParam({ name: 'id', description: 'ID du tournoi' })
  @ApiResponse({ status: 200, description: 'Tournoi mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Tournoi non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 400, description: 'Erreur de validation.' })
  async update(@Param('id') id: string, @Body() updateTournamentDto: UpdateTournamentDto, @Req() req: any) {
    const academyId = req.user.userId;
    return this.tournamentsService.update(id, updateTournamentDto, academyId);
  }

  @Delete(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Supprimer un tournoi' })
  @ApiParam({ name: 'id', description: 'ID du tournoi' })
  @ApiResponse({ status: 200, description: 'Tournoi supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Tournoi non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const academyId = req.user.userId;
    await this.tournamentsService.remove(id, academyId);
    return { message: 'Tournoi supprimé avec succès' };
  }
}

