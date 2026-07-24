import { createHelpdeskTicketSchema } from "@repo/schema";
import { createZodDto } from "nestjs-zod";

export class CreateHelpdeskTicketDto extends createZodDto(createHelpdeskTicketSchema) {}
