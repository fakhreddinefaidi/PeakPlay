import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';
import { Academy, AcademySchema } from 'src/schemas/academy.schema';
import { User, UserSchema } from 'src/schemas/user.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Academy.name, schema: AcademySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AcademyController],
  providers: [AcademyService],
  exports: [AcademyService],
})
export class AcademyModule {}

