import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HelpdeskTicketController } from "./helpdesk-ticket.controller";
import { HelpdeskTicketService } from "./helpdesk-ticket.service";
import { HelpdeskTicketRepository } from "./helpdesk-ticket.repository";
import {
  HelpdeskTicket,
  HelpdeskTicketSchema,
} from "./entities/helpdesk-ticket.entity";
import { AuthModule } from "../auth/auth.module";
import { TokenModule } from "../shared/token/token.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelpdeskTicket.name, schema: HelpdeskTicketSchema },
    ]),
    AuthModule,
    TokenModule,
  ],
  controllers: [HelpdeskTicketController],
  providers: [HelpdeskTicketService, HelpdeskTicketRepository],
  exports: [HelpdeskTicketService, HelpdeskTicketRepository],
})
export class HelpdeskTicketModule {}
