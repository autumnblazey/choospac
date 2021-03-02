import { object, boolean, number, string } from "zod";

export const configvalidator = object({
   https: boolean().default(false),
   redirect: boolean().default(true),

   HTTPport: number().nonnegative().max(2 ** 16).default(8080),
   HTTPSport: number().nonnegative().max(2 ** 16).default(8081),

   certs: object({
      ca: string(),
      cert: string(),
      key: string()
   }).default({
      ca: "/path/to/chain.pem",
      cert: "/path/to/cert.pem",
      key: "/path/to/privkey.pem"
   })
});
