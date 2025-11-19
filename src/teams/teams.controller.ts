import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@ApiTags('Teams')
@ApiBearerAuth('access-token')
@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Créer une nouvelle équipe' })
  @ApiResponse({ status: 201, description: 'Équipe créée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé : rôle ACADEMY requis.' })
  async create(@Body() createTeamDto: CreateTeamDto, @Req() req: any) {
    const academyId = req.user.userId;
    return this.teamsService.create(createTeamDto, academyId);
  }

  @Get()
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer toutes les équipes de l\'académie' })
  @ApiResponse({ status: 200, description: 'Liste des équipes récupérée avec succès.' })
  async findAll(@Req() req: any) {
    const academyId = req.user.userId;
    return this.teamsService.findAll(academyId);
  }

  @Get(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer une équipe par ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'équipe' })
  @ApiResponse({ status: 200, description: 'Équipe trouvée.' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const academyId = req.user.userId;
    return this.teamsService.findOne(id, academyId);
  }

  @Patch(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Mettre à jour une équipe' })
  @ApiParam({ name: 'id', description: 'ID de l\'équipe' })
  @ApiResponse({ status: 200, description: 'Équipe mise à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @Req() req: any) {
    const academyId = req.user.userId;
    return this.teamsService.update(id, updateTeamDto, academyId);
  }

  @Delete(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Supprimer une équipe' })
  @ApiParam({ name: 'id', description: 'ID de l\'équipe' })
  @ApiResponse({ status: 200, description: 'Équipe supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const academyId = req.user.userId;
    await this.teamsService.remove(id, academyId);
    return { message: 'Équipe supprimée avec succès' };
  }
}

