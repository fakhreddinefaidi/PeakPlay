import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Referee } from 'src/schemas/referee.schema';
import { CreateRefereeDto } from './dto/create-referee.dto';
import { UpdateRefereeDto } from './dto/update-referee.dto';

@Injectable()
export class RefereesService {
  constructor(
    @InjectModel(Referee.name) private refereeModel: Model<Referee>,
  ) {}

  async create(createRefereeDto: CreateRefereeDto, academyId: string): Promise<Referee> {
    // Vérifier que l'email n'est pas déjà utilisé par un autre arbitre de la même académie
    const existingReferee = await this.refereeModel.findOne({
      email: createRefereeDto.email,
      academyId: new Types.ObjectId(academyId),
    }).exec();

    if (existingReferee) {
      throw new ConflictException('Un arbitre avec cet email existe déjà dans votre académie');
    }

    const referee = new this.refereeModel({
      ...createRefereeDto,
      academyId: new Types.ObjectId(academyId),
      assignedMatches: [],
    });
    return referee.save();
  }

  async findAll(academyId: string): Promise<Referee[]> {
    return this.refereeModel.find({ academyId: new Types.ObjectId(academyId) }).exec();
  }

  async findOne(id: string, academyId: string): Promise<Referee> {
    const referee = await this.refereeModel.findById(id).exec();
    if (!referee) {
      throw new NotFoundException('Arbitre non trouvé');
    }
    if (referee.academyId.toString() !== academyId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à cet arbitre');
    }
    return referee;
  }

  async update(id: string, updateRefereeDto: UpdateRefereeDto, academyId: string): Promise<Referee> {
    const referee = await this.findOne(id, academyId);

    // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
    if (updateRefereeDto.email && updateRefereeDto.email !== referee.email) {
      const existingReferee = await this.refereeModel.findOne({
        email: updateRefereeDto.email,
        academyId: new Types.ObjectId(academyId),
        _id: { $ne: id },
      }).exec();

      if (existingReferee) {
        throw new ConflictException('Un arbitre avec cet email existe déjà dans votre académie');
      }
    }

    Object.assign(referee, updateRefereeDto);
    return referee.save();
  }

  async remove(id: string, academyId: string): Promise<void> {
    const referee = await this.findOne(id, academyId);
    await this.refereeModel.findByIdAndDelete(id).exec();
  }
}

