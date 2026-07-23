import { createComplaintSchema } from "@repo/schema";
import { createZodDto } from "nestjs-zod";

export class CreateComplaintDto extends createZodDto(createComplaintSchema) {}
