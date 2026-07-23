import { addTimelineEntrySchema } from "@repo/schema";
import { createZodDto } from "nestjs-zod";

export class AddTimelineEntryDto extends createZodDto(addTimelineEntrySchema) {}
