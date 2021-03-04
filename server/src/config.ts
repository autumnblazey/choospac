import fs from "fs";
import path from "path";
import { object, boolean, number, string } from "zod";
import JSON5 from "json5";
import { error } from "./log";

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

export function getconfig() {
   const configpath = path.resolve(__dirname, "../../config.json5");
   const configstr: string = !fs.existsSync(configpath) ? "{}" : fs.readFileSync(configpath).toString();
   let configraw;
   try {
      configraw = JSON5.parse(configstr);
   } catch {
      throw void error("syntax error in config!");
   }

   let configparseres = configvalidator.safeParse(configraw);
   // if (!configparseres.success) {
   //    // if it ain't, try it again with default
   //    configraw = {};
   //    configparseres = configvalidator.safeParse(configraw);
   //    if (!configparseres.success) throw void error("config is invalid!", configparseres.error);
   // }
   if (!configparseres.success) throw void error("config is invalid!", configparseres.error);
   return configparseres.data;
}
