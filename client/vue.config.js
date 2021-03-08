// @ts-check

require("json5/lib/register");

/** @type {import("@vue/cli-service").ProjectOptions} */
module.exports = {
   lintOnSave: false,
   devServer: {
      public: "localhost:8080"
   },
   chainWebpack: config => {
      config.devtool("source-map");
      config.module
         .rule("json5")
         .test(/\.json5$/)
         .use("json5-loader")
         .loader("json5-loader")
         .end();
   }
};
