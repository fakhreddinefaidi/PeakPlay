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
import { RefereesService } from './referees.service';
import { CreateRefereeDto } from './dto/create-referee.dto';
import { UpdateRefereeDto } from './dto/update-referee.dto';

@ApiTags('Referees')
@ApiBearerAuth('access-token')
@Controller('referees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RefereesController {
  constructor(private readonly refereesService: RefereesService) {}

  @Post()
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Créer un nouvel arbitre' })
  @ApiResponse({ status: 201, description: 'Arbitre créé avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé : rôle ACADEMY requis.' })
  @ApiResponse({ status: 409, description: 'Un arbitre avec cet email existe déjà.' })
  async create(@Body() createRefereeDto: CreateRefereeDto, @Req() req: any) {
    const academyId = req.user.userId;
    return this.refereesService.create(createRefereeDto, academyId);
  }

  @Get()
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer tous les arbitres de l\'académie' })
  @ApiResponse({ status: 200, description: 'Liste des arbitres récupérée avec succès.' })
  async findAll(@Req() req: any) {
    const academyId = req.user.userId;
    return this.refereesService.findAll(academyId);
  }

  @Get(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer un arbitre par ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'arbitre' })
  @ApiResponse({ status: 200, description: 'Arbitre trouvé.' })
  @ApiResponse({ status: 404, description: 'Arbitre non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const academyId = req.user.userId;
    return this.refereesService.findOne(id, academyId);
  }

  @Patch(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Mettre à jour un arbitre' })
  @ApiParam({ name: 'id', description: 'ID de l\'arbitre' })
  @ApiResponse({ status: 200, description: 'Arbitre mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Arbitre non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 409, description: 'Un arbitre avec cet email existe déjà.' })
  async update(@Param('id') id: string, @Body() updateRefereeDto: UpdateRefereeDto, @Req() req: any) {
    const academyId = req.user.userId;
    return this.refereesService.update(id, updateRefereeDto, academyId);
  }

  @Delete(':id')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Supprimer un arbitre' })
  @ApiParam({ name: 'id', description: 'ID de l\'arbitre' })
  @ApiResponse({ status: 200, description: 'Arbitre supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Arbitre non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const academyId = req.user.userId;
    await this.refereesService.remove(id, academyId);
    return { message: 'Arbitre supprimé avec succès' };
  }
}

