import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { VisitorRepository } from './visitor.repository';
import { Visitor, VisitorSchema } from './entities/visitor.entity';
import { ResidentModule } from '../resident/resident.module';
import { FlatModule } from '../flat/flat.module';
import { TokenModule } from '../shared/token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visitor.name, schema: VisitorSchema }]),
    ResidentModule,
    FlatModule,
    TokenModule,
  ],
  controllers: [VisitorController],
  providers: [VisitorService, VisitorRepository],
  exports: [VisitorService, VisitorRepository],
})
export class VisitorModule { }
