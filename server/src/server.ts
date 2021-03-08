import fs from "fs";
import path from "path";
import http from "http";
import http2 from "http2";
import cluster, { isMaster, fork } from "cluster";
import os from "os";
import z from "zod";
import { log } from "./log";
import { getconfig } from "./config";
import mimedb from "mime-db";

isMaster ? main() : worker();

function main() {
   const numworkers = os.cpus().length;
   log(`spawning ${numworkers} workers`);

   cluster.schedulingPolicy = cluster.SCHED_RR;
   Array(numworkers).fill(null).forEach(fork);
   cluster.on("exit", (worker, code, signal) => {
      log("worker died lol");
      log("heres where I would fork another, but want to avoid infinite looping");
   });
}

async function worker() {
   const config = getconfig();

   const httpserver = createHTTPserver(config.HTTPport);
   const httpsserver = config.https ? createHTTPSserver(config.HTTPSport, {
      ...config.certs
   }) : undefined;

   log("up!");
}

function createHTTPserver(port: number, handler?: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
   const serv = http.createServer({}, handler ?? requesthandler);
   serv.listen(port);
   return serv;
}

function createHTTPSserver(port: number, opts: {
   ca: string;
   cert: string;
   key: string;
}, handler?: (req: http2.Http2ServerRequest, res: http2.Http2ServerResponse) => void) {
   const serv = http2.createSecureServer({
      allowHTTP1: true,
      ca: fs.readFileSync(opts.ca),
      cert: fs.readFileSync(opts.cert),
      key: fs.readFileSync(opts.key)
   }, handler ?? requesthandler);
}

function createHTTPSRedirector(port: number) {
   return createHTTPserver(port, (req, res) => {
      if (!req.headers.host || !req.url) return void res.writeHead(400) ?? res.end();
      res.writeHead(301, { location: `https://${req.headers.host}${req.url}` });
      res.end();
   });
}

function mime(ext: string) {
   ext.startsWith(".") && (ext = ext.substring(1));
   const foundmime = Object.entries(mimedb)
         .find(mime => mime[1].extensions !== undefined && mime[1].extensions.includes(ext));
   return foundmime ? foundmime[0] : false;
}

function writetores(res: http2.Http2ServerResponse | http.ServerResponse) {
   // return function(chunk: any) {
   //    res instanceof http2.Http2ServerResponse
   //    ? res.write(chunk)
   //    : res.write(chunk);
   // }
   return res instanceof http2.Http2ServerResponse
      ? function(chunk: any) {
         res.write(chunk);
      } : function(chunk: any) {
         res.write(chunk);
      }
   // typescript you what bruh
}

const filepath = path.resolve(process.cwd(), "../client/dist");
const indexfile = fs.readFileSync(path.resolve(filepath, "./index.html"));
const filecache: { [key: string]: any } = {
   "/": indexfile
};

function requesthandler(
   req: http2.Http2ServerRequest | http.IncomingMessage,
   res: http2.Http2ServerResponse | http.ServerResponse
) {
   let url = req.url;
   if (!url) url = "/";
   // console.log(url);

   // try to get a file
   let file;
   let mimetype = mime(path.extname(url));
   let code = 200;

   try {
      file = fs.readFileSync(path.resolve(filepath, url.startsWith("/") ? url.substring(1) : url));
   } catch {
      file = indexfile;
      mimetype = "text/html";
   }

   const write = writetores(res);

   res.setHeader("content-type", mimetype ? mimetype : "application/octet-stream");
   res.setHeader("x-content-type-options", "nosniff");
   res.writeHead(code);
   write(file);
   res.end();
}
