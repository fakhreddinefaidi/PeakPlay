import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JoinRequestsController } from './join-requests.controller';
import { JoinRequestsService } from './join-requests.service';
import { JoinRequest, JoinRequestSchema } from 'src/schemas/join-request.schema';
import { Team, TeamSchema } from 'src/schemas/team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JoinRequest.name, schema: JoinRequestSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
  ],
  controllers: [JoinRequestsController],
  providers: [JoinRequestsService],
  exports: [JoinRequestsService],
})
export class JoinRequestsModule {}

