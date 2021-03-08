// why do all these methods return false?
// thats when it errored somehow. yos
// but they also hide all errors from you, so maybe theyre a bit difficult to debug lol
// ill maybe change in future

// also, none of these methods are caching as you can probably see lol

import fs from "fs";
import path from "path";
import JSON5 from "json5";
import { manifestvalidator } from "../manifest";
import { inspect } from "util";

function readdir(dir: string): Array<string> | false {
   try {
      const dircontents = fs.statSync(dir).isDirectory() && fs.readdirSync(dir);
      return dircontents;
   } catch {
      return false;
   }
}
// export function getDirs(thing: string, basepath: string): string | false {}
// export function getNonCommonDirs(reldir: string, basepath: string): string | false {}
function filterOutNonDirs(dir: string) {
   return function(reldir: string) {
      try {
         return fs.statSync(path.resolve(dir, reldir)).isDirectory();
      } catch {
         return false;
      }
   }
}
function filterOutCommon(dir: string): boolean {
   return dir !== "common"
}

const versionsdirregex = /^pack_v(1|2|3|4|5|6|7)$/;
function getVersionsRelativePaths(dir: string): Array<string> | false {
   const contents = readdir(dir);
   return contents && contents.filter(filterOutNonDirs(dir)).filter(filterOutCommon).filter(dir => versionsdirregex.test(dir));
}

function getVersionsAbsolutePaths(dir: string): Array<string> | false {
   const contents = getVersionsRelativePaths(dir);
   return contents && contents.map(v => path.resolve(dir, v));
}

function getVersionNumbers(dir: string): Array<number> | false {
   const versions = getVersionsRelativePaths(dir);
   return versions && versions.map(v => Number(v.substring("pack_v".length)));
}

function getTexturesRelativePaths(dir: string): Array<string> | false {
   const contents = readdir(dir);
   return contents && contents.filter(filterOutNonDirs(dir)).filter(filterOutCommon);
}

function getTexturesAbsolutePaths(dir: string): Array<string> | false {
   const contents = getTexturesRelativePaths(dir);
   return contents && contents.map(t => path.resolve(dir, t));
}

function getOptionsRelativePaths(dir: string): Array<string> | false {
   const contents = readdir(dir);
   return contents && contents.filter(filterOutNonDirs(dir)).filter(filterOutCommon);
}

function getOptionsAbsolutePaths(dir: string): Array<string> | false {
   const contents = getOptionsRelativePaths(dir);
   return contents && contents.map(o => path.resolve(dir, o));
}

function readManifest(file: string) {
   let readfile: string;
   try {
      readfile = fs.readFileSync(file).toString();
   } catch {
      readfile = "{}";
   }

   let parsedany: any;
   try {
      parsedany = JSON5.parse(readfile);
   } catch {
      parsedany = {};
   }

   try {
      return manifestvalidator.parse(parsedany);
   } catch {
      return false;
   }
}

function buildOptionManifest(dir: string): any | false {
   return readManifest(path.resolve(dir, "manifest.choospac"));
}
function buildTextureManifest(dir: string): any | false {
   const options = getOptionsRelativePaths(dir);
   if (options === false) return false;

   const manifest: any = {};
   for (const opt of options) {
      const optm = buildOptionManifest(path.resolve(dir, opt));
      if (optm === false) return false;
      manifest[opt] = optm;
   }
   // manifest._ = options;
   return manifest;
}
function buildVersionManifest(dir: string): any | false {
   const textures = getTexturesRelativePaths(dir);
   if (textures === false) return false;

   const manifest: any = {};
   for (const texture of textures) {
      const texturem = buildTextureManifest(path.resolve(dir, texture));
      if (texturem === false) return false;
      manifest[texture] = texturem;
   }
   // manifest._ = textures;
   return manifest;
}
function buildDataManifest(dir: string): any | false {
   const versions = getVersionNumbers(dir);
   if (versions === false) return false;

   const manifest: any = {};
   for (const version of versions) {
      const versionm = buildVersionManifest(path.resolve(dir, `pack_v${version}`));
      if (versionm === false) return false;
      manifest[version] = versionm;
   }
   // manifest._ = versions;
   return manifest;
}
export function buildManifest(dir: string): any | false {
   return buildDataManifest(dir);
}
