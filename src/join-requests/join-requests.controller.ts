import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';
import { JoinRequestsService } from './join-requests.service';

@ApiTags('Join Requests')
@ApiBearerAuth('access-token')
@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JoinRequestsController {
  constructor(private readonly joinRequestsService: JoinRequestsService) {}

  @Get(':teamId/requests')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer toutes les demandes d\'adhésion d\'une équipe' })
  @ApiParam({ name: 'teamId', description: 'ID de l\'équipe' })
  @ApiResponse({ status: 200, description: 'Liste des demandes récupérée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 404, description: 'Équipe non trouvée.' })
  async getRequests(@Param('teamId') teamId: string, @Req() req: any) {
    const academyId = req.user.userId;
    return this.joinRequestsService.findAllByTeam(teamId, academyId);
  }

  @Post(':teamId/requests/:requestId/accept')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Accepter une demande d\'adhésion' })
  @ApiParam({ name: 'teamId', description: 'ID de l\'équipe' })
  @ApiParam({ name: 'requestId', description: 'ID de la demande' })
  @ApiResponse({ status: 200, description: 'Demande acceptée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 404, description: 'Demande ou équipe non trouvée.' })
  @ApiResponse({ status: 400, description: 'Erreur de validation.' })
  async acceptRequest(
    @Param('teamId') teamId: string,
    @Param('requestId') requestId: string,
    @Req() req: any,
  ) {
    const academyId = req.user.userId;
    return this.joinRequestsService.accept(teamId, requestId, academyId);
  }

  @Post(':teamId/requests/:requestId/reject')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Refuser une demande d\'adhésion' })
  @ApiParam({ name: 'teamId', description: 'ID de l\'équipe' })
  @ApiParam({ name: 'requestId', description: 'ID de la demande' })
  @ApiResponse({ status: 200, description: 'Demande refusée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  @ApiResponse({ status: 404, description: 'Demande ou équipe non trouvée.' })
  @ApiResponse({ status: 400, description: 'Erreur de validation.' })
  async rejectRequest(
    @Param('teamId') teamId: string,
    @Param('requestId') requestId: string,
    @Req() req: any,
  ) {
    const academyId = req.user.userId;
    return this.joinRequestsService.reject(teamId, requestId, academyId);
  }
}

