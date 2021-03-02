import { spawn } from "child_process";

console.log(`(PID ${process.pid} LAUNCH) starting server...`);
const server = spawn("node", ["dist/server"], {
   cwd: process.cwd(),
   env: process.env,
   stdio: "inherit"
});

process.on("SIGINT", () => server.kill("SIGINT"));
process.on("SIGTERM", () => server.kill("SIGTERM"));
