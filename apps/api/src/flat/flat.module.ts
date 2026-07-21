import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlatController } from './flat.controller';
import { FlatService } from './flat.service';
import { FlatRepository } from './flat.repository';
import { Flat, FlatSchema } from './entities/flat.entity';
import { TokenModule } from '../shared/token/token.module';
import { SocietyModule } from '../society/society.module';
import { TowerModule } from '../tower/tower.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flat.name, schema: FlatSchema }]),
    TokenModule,
    SocietyModule,
    TowerModule,
  ],
  controllers: [FlatController],
  providers: [FlatService, FlatRepository],
  exports: [FlatService, FlatRepository],
})
export class FlatModule {}
