import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JoinRequest } from 'src/schemas/join-request.schema';
import { Team } from 'src/schemas/team.schema';

@Injectable()
export class JoinRequestsService {
  constructor(
    @InjectModel(JoinRequest.name) private joinRequestModel: Model<JoinRequest>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ) {}

  async findAllByTeam(teamId: string, academyId: string): Promise<JoinRequest[]> {
    // Vérifier que l'équipe appartient à l'académie
    const team = await this.teamModel.findById(teamId).exec();
    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }
    if (team.academyId.toString() !== academyId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à cette équipe');
    }

    return this.joinRequestModel.find({ teamId: new Types.ObjectId(teamId) }).exec();
  }

  async accept(teamId: string, requestId: string, academyId: string): Promise<JoinRequest> {
    const request = await this.joinRequestModel.findById(requestId).exec();
    if (!request) {
      throw new NotFoundException('Demande d\'adhésion non trouvée');
    }

    // Vérifier que la demande correspond à l'équipe
    if (request.teamId.toString() !== teamId) {
      throw new BadRequestException('La demande ne correspond pas à cette équipe');
    }

    // Vérifier que l'équipe appartient à l'académie
    const team = await this.teamModel.findById(teamId).exec();
    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }
    if (team.academyId.toString() !== academyId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à gérer cette équipe');
    }

    // Vérifier que la demande est en attente
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Cette demande a déjà été traitée');
    }

    // Vérifier que l'équipe n'a pas atteint le maximum de joueurs
    if (team.players.length >= team.maxPlayers) {
      throw new BadRequestException('L\'équipe a atteint le nombre maximum de joueurs');
    }

    // Vérifier que le joueur n'est pas déjà dans l'équipe
    if (team.players.some(p => p.toString() === request.playerId.toString())) {
      throw new BadRequestException('Le joueur est déjà dans l\'équipe');
    }

    // Ajouter le joueur à l'équipe
    team.players.push(request.playerId);
    await team.save();

    // Mettre à jour le statut de la demande
    request.status = 'ACCEPTED';
    return request.save();
  }

  async reject(teamId: string, requestId: string, academyId: string): Promise<JoinRequest> {
    const request = await this.joinRequestModel.findById(requestId).exec();
    if (!request) {
      throw new NotFoundException('Demande d\'adhésion non trouvée');
    }

    // Vérifier que la demande correspond à l'équipe
    if (request.teamId.toString() !== teamId) {
      throw new BadRequestException('La demande ne correspond pas à cette équipe');
    }

    // Vérifier que l'équipe appartient à l'académie
    const team = await this.teamModel.findById(teamId).exec();
    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }
    if (team.academyId.toString() !== academyId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à gérer cette équipe');
    }

    // Vérifier que la demande est en attente
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Cette demande a déjà été traitée');
    }

    // Mettre à jour le statut de la demande
    request.status = 'REJECTED';
    return request.save();
  }
}

