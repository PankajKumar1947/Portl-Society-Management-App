import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ComplaintController } from "./complaint.controller";
import { ComplaintService } from "./complaint.service";
import { ComplaintRepository } from "./complaint.repository";
import { Complaint, ComplaintSchema } from "./entities/complaint.entity";
import { AuthModule } from "../auth/auth.module";
import { TokenModule } from "../shared/token/token.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
    ]),
    AuthModule,
    TokenModule,
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService, ComplaintRepository],
  exports: [ComplaintService, ComplaintRepository],
})
export class ComplaintModule {}
