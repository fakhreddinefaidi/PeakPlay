import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Academy } from 'src/schemas/academy.schema';
import { User } from 'src/schemas/user.schemas';
import { UpdateAcademyDto } from './dto/update-academy.dto';

@Injectable()
export class AcademyService {
  constructor(
    @InjectModel(Academy.name) private academyModel: Model<Academy>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findOneByUserId(userId: string): Promise<any> {
    // Récupérer le profil académie
    let academy = await this.academyModel.findOne({ userId }).exec();
    if (!academy) {
      // Créer automatiquement un profil académie vide si il n'existe pas
      academy = new this.academyModel({
        userId,
        academyName: null,
        logoUrl: null,
        address: null,
        phone: null,
        responsableName: null,
        categories: [],
      });
      await academy.save();
    }

    // Récupérer les données de l'utilisateur
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Combiner les données
    const { password, ...userData } = user.toObject();
    const academyData = academy.toObject();

    return {
      ...academyData,
      user: {
        _id: userData._id,
        email: userData.email,
        prenom: userData.prenom,
        nom: userData.nom,
        age: userData.age,
        tel: userData.tel,
        role: userData.role,
        emailVerified: userData.emailVerified,
        picture: userData.picture,
        provider: userData.provider,
      },
    };
  }

  async createOrUpdate(userId: string, updateAcademyDto: UpdateAcademyDto): Promise<Academy> {
    const academy = await this.academyModel.findOneAndUpdate(
      { userId },
      { ...updateAcademyDto, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
    return academy;
  }

  async update(userId: string, updateAcademyDto: UpdateAcademyDto): Promise<Academy> {
    const academy = await this.academyModel.findOneAndUpdate(
      { userId },
      { ...updateAcademyDto, updatedAt: new Date() },
      { new: true }
    ).exec();

    if (!academy) {
      throw new NotFoundException('Profil académie non trouvé');
    }

    return academy;
  }

  async verifyOwnership(academyId: string, userId: string): Promise<void> {
    const academy = await this.academyModel.findById(academyId).exec();
    if (!academy) {
      throw new NotFoundException('Académie non trouvée');
    }
    if (academy.userId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à cette académie');
    }
  }
}

