import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AmenityService } from "./amenity.service";
import { AmenityController } from "./amenity.controller";
import { AmenityRepository } from "./amenity.repository";
import { Amenity, AmenitySchema } from "./entities/amenity.entity";
import { TokenModule } from "../shared/token/token.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Amenity.name, schema: AmenitySchema }]),
    TokenModule,
  ],
  controllers: [AmenityController],
  providers: [AmenityService, AmenityRepository],
  exports: [AmenityService, AmenityRepository],
})
export class AmenityModule {}
