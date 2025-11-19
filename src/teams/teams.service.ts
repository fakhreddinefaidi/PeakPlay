import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team } from 'src/schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto, academyId: string): Promise<Team> {
    const team = new this.teamModel({
      ...createTeamDto,
      academyId: new Types.ObjectId(academyId),
      players: [],
    });
    return team.save();
  }

  async findAll(academyId: string): Promise<Team[]> {
    return this.teamModel.find({ academyId: new Types.ObjectId(academyId) }).exec();
  }

  async findOne(id: string, academyId: string): Promise<Team> {
    const team = await this.teamModel.findById(id).exec();
    if (!team) {
      throw new NotFoundException('Équipe non trouvée');
    }
    if (team.academyId.toString() !== academyId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à cette équipe');
    }
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, academyId: string): Promise<Team> {
    const team = await this.findOne(id, academyId);
    
    // Vérifier que le nombre de joueurs ne dépasse pas maxPlayers
    if (updateTeamDto.maxPlayers && team.players.length > updateTeamDto.maxPlayers) {
      throw new BadRequestException('Le nombre maximum de joueurs ne peut pas être inférieur au nombre actuel de joueurs');
    }

    Object.assign(team, updateTeamDto);
    return team.save();
  }

  async remove(id: string, academyId: string): Promise<void> {
    const team = await this.findOne(id, academyId);
    await this.teamModel.findByIdAndDelete(id).exec();
  }

  async addPlayer(teamId: string, playerId: string, academyId: string): Promise<Team> {
    const team = await this.findOne(teamId, academyId);
    
    if (team.players.length >= team.maxPlayers) {
      throw new BadRequestException('L\'équipe a atteint le nombre maximum de joueurs');
    }

    const playerObjectId = new Types.ObjectId(playerId);
    if (team.players.some(p => p.toString() === playerId)) {
      throw new BadRequestException('Le joueur est déjà dans l\'équipe');
    }

    team.players.push(playerObjectId);
    return team.save();
  }

  async removePlayer(teamId: string, playerId: string, academyId: string): Promise<Team> {
    const team = await this.findOne(teamId, academyId);
    team.players = team.players.filter(p => p.toString() !== playerId);
    return team.save();
  }
}

