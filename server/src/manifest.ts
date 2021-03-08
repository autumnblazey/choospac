import z, { object, boolean, number, string } from "zod";

export const manifestvalidator = object({
   description: string().default("No description provided")
});

export type manifest = z.infer<typeof manifestvalidator>;
