import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';
import { AcademyService } from './academy.service';
import { UpdateAcademyDto } from './dto/update-academy.dto';

@ApiTags('Academy')
@ApiBearerAuth('access-token')
@Controller('academy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('me')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Récupérer le profil de l\'académie connectée avec les données utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profil récupéré avec succès. Inclut les données du profil académie et les données de l\'utilisateur.',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        userId: { type: 'string' },
        academyName: { type: 'string', nullable: true },
        logoUrl: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
        phone: { type: 'string', nullable: true },
        responsableName: { type: 'string', nullable: true },
        categories: { type: 'array', items: { type: 'string' } },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            prenom: { type: 'string' },
            nom: { type: 'string' },
            age: { type: 'string', format: 'date-time' },
            tel: { type: 'number' },
            role: { type: 'string', enum: ['JOUEUR', 'ACADEMY', 'ARBITRE'] },
            emailVerified: { type: 'boolean' },
            picture: { type: 'string', nullable: true },
            provider: { type: 'string', nullable: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Accès refusé : rôle ACADEMY requis.' })
  @ApiResponse({ status: 404, description: 'Profil académie ou utilisateur non trouvé.' })
  async getMyProfile(@Req() req: any) {
    const userId = req.user.userId;
    return this.academyService.findOneByUserId(userId);
  }

  @Put('me')
  @Roles('ACADEMY')
  @ApiOperation({ summary: 'Mettre à jour le profil de l\'académie connectée' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé : rôle ACADEMY requis.' })
  async updateMyProfile(@Req() req: any, @Body() updateAcademyDto: UpdateAcademyDto) {
    const userId = req.user.userId;
    return this.academyService.createOrUpdate(userId, updateAcademyDto);
  }
}

