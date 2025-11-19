import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament } from 'src/schemas/tournament.schema';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name) private tournamentModel: Model<Tournament>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto, academyId: string): Promise<Tournament> {
    // Vérifier que la date de fin est après la date de début
    if (new Date(createTournamentDto.endDate) <= new Date(createTournamentDto.startDate)) {
      throw new BadRequestException('La date de fin doit être après la date de début');
    }

    const tournament = new this.tournamentModel({
      ...createTournamentDto,
      academyId: new Types.ObjectId(academyId),
      status: 'UPCOMING',
    });
    return tournament.save();
  }

  async findAll(academyId: string, status?: string): Promise<Tournament[]> {
    const query: any = { academyId: new Types.ObjectId(academyId) };
    if (status) {
      query.status = status;
    }
    return this.tournamentModel.find(query).sort({ startDate: 1 }).exec();
  }

  async findOne(id: string, academyId: string): Promise<Tournament> {
    const tournament = await this.tournamentModel.findById(id).exec();
    if (!tournament) {
      throw new NotFoundException('Tournoi non trouvé');
    }
    if (tournament.academyId.toString() !== academyId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à ce tournoi');
    }
    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto, academyId: string): Promise<Tournament> {
    const tournament = await this.findOne(id, academyId);

    // Vérifier que la date de fin est après la date de début si les deux sont fournies
    if (updateTournamentDto.startDate && updateTournamentDto.endDate) {
      if (new Date(updateTournamentDto.endDate) <= new Date(updateTournamentDto.startDate)) {
        throw new BadRequestException('La date de fin doit être après la date de début');
      }
    } else if (updateTournamentDto.endDate && tournament.startDate) {
      if (new Date(updateTournamentDto.endDate) <= tournament.startDate) {
        throw new BadRequestException('La date de fin doit être après la date de début');
      }
    } else if (updateTournamentDto.startDate && tournament.endDate) {
      if (tournament.endDate <= new Date(updateTournamentDto.startDate)) {
        throw new BadRequestException('La date de fin doit être après la date de début');
      }
    }

    Object.assign(tournament, updateTournamentDto);
    return tournament.save();
  }

  async remove(id: string, academyId: string): Promise<void> {
    const tournament = await this.findOne(id, academyId);
    await this.tournamentModel.findByIdAndDelete(id).exec();
  }
}

