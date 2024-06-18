import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const taskSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    details: z.string().min(1).optional(),
    dueDate: z.string().optional(),
    dueTime: z.string().optional(),
    group: z.number(),
  })
);
