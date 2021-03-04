import { isMaster } from "cluster";

export function logtofn(fn: typeof console.log, ...msgs: any) {
   fn(`(PID ${process.pid} ${isMaster ? "MASTER" : "WORKER"}) ${msgs.join(" ")}`);
}
export function log(...msgs: any) {
   logtofn(console.log, ...msgs);
}
export function error(...msgs: any) {
   logtofn(console.error, ...msgs);
}
