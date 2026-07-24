import { addHelpdeskTimelineEntrySchema } from "@repo/schema";
import { createZodDto } from "nestjs-zod";

export class AddHelpdeskTimelineEntryDto extends createZodDto(addHelpdeskTimelineEntrySchema) {}
