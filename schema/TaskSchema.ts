import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const taskSchema = toTypedSchema(
  z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1),
    details: z.string().min(1).nullable().optional(),
    dueDate: z.string().nullable().optional(),
    dueTime: z.string().nullable().optional(),
    done: z.boolean().nullable().optional(),
    groupId: z.number(),
  })
);
