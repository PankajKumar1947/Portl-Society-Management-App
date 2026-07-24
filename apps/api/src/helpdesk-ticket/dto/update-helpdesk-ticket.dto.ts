import { updateHelpdeskTicketSchema } from "@repo/schema";
import { createZodDto } from "nestjs-zod";

export class UpdateHelpdeskTicketDto extends createZodDto(updateHelpdeskTicketSchema) {}
