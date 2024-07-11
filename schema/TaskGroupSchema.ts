import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const taskGroupSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
  })
);

export const taskGroupDeleteSchema = toTypedSchema(
  z.object({
    id: z.number(),
  })
);

export const taskGroupRenameSchema = toTypedSchema(
  z.object({
    id: z.number(),
    name: z.string().min(1),
  })
);
