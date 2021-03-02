// @ts-check
"use strict";

const { spawn } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

/**
 * @type {{
 *    [key: string]: undefined | {
 *       client?: string | Array<string>;
 *       server?: string | Array<string>;
 *    };
 * }}
 */
const scripts = {
   // put scripts to run here
   // when someone does `node script-runner build`
   build: {
      // command(s) to run in client dir
      client: ["pnpm run build"],
      // command(s) to run in server dir
      server: ["pnpm run build"]
   },
   // node script-runner start etc
   start: {
      server: ["pnpm start"]
   }
}


/**
 * @param {string | Array<string>} cmd command to run
 * @param {string} cwd working dir in which to run the cmd in, relative to process.cwd()
 * @return {Promise<void>}
 */
function runcmd(cmd, cwd) {
   cwd = path.resolve(process.cwd(), cwd);
   const arraycmd = Array.isArray(cmd) ? cmd : [cmd];
   let promise = Promise.resolve();
   arraycmd.forEach(cmd => promise = promise.then(() => new Promise((res, rej) => {
      const argarray = cmd.split(/ +/g);
      const spawned = spawn(argarray.shift(), argarray, {
         stdio: "inherit",
         env: process.env,
         cwd
      });
      spawned.on("exit", code => code === 0 ? res() : rej(code));
   })));
   return promise;
}

// main
(async () => {
   if (os.platform() === "win32") throw "get off of windows!";

   const argv = process.argv.slice(2);
   if (!(argv.length > 0)) throw "no commands specified to run!";

   const script = argv.shift();
   const cmds = scripts[script];
   if (!cmds) throw `script "${script}" not found`;

   if (argv.length > 0) for (const folder of argv) {
      if (cmds[folder]) await runcmd(cmds[folder], folder);
   } else {
      if (cmds.client) await runcmd(cmds.client, "client");
      if (cmds.server) await runcmd(cmds.server, "server");
   }
})().catch(e => {
   console.log(typeof e === "number" ? `running a command exited with ${e}` : e);
   process.exitCode = 1;
});
