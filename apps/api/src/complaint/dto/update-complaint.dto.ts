import { updateComplaintSchema } from "@repo/schema";
import { createZodDto } from "nestjs-zod";

export class UpdateComplaintDto extends createZodDto(updateComplaintSchema) {}
