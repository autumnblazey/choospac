import fs from "fs";
import path from "path";
import http from "http";
import http2 from "http2";
import cluster, { isMaster, fork } from "cluster";
import os from "os";
import z from "zod";

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
   const { configvalidator } = await import("./config");
   const JSON5 = await import("json5");

   const configpath = path.resolve(__dirname, "../../config.json5");
   const configstr: string = !fs.existsSync(configpath) ? "{}" : fs.readFileSync(configpath).toString();
   let configraw;
   try {
      configraw = JSON5.parse(configstr);
   } catch {
      error("syntax error in config");
      configraw = {};
   }

   const configparseres = configvalidator.safeParse(configraw);
   if (!configparseres.success) throw void error("config is invalid!", configparseres.error);
   const config = configparseres.data;

   const httpserver = createHTTPserver(config.HTTPport);
   const httpsserver = config.https ? createHTTPSserver(config.HTTPSport, {
      ...config.certs
   }) : undefined;

   log("up!");
}

function requesthandler(
   req: http2.Http2ServerRequest | http.IncomingMessage,
   res: http2.Http2ServerResponse | http.ServerResponse
) {
   let url = req.url;
   if (!url) url = "/";
   log(url);

   res.writeHead(204);
   res.end();
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

function createredirector(port: number) {
   throw "create redirector doesnt work yet";
   return createHTTPserver(port, (req, res) => {
      //
   });
}

function logtofn(fn: typeof console.log, ...msgs: any) {
   fn(`(PID ${process.pid} ${isMaster ? "MASTER" : "WORKER"}) ${msgs.join(" ")}`);
}
function log(...msgs: any) {
   logtofn(console.log, ...msgs);
}
function error(...msgs: any) {
   logtofn(console.error, ...msgs);
}