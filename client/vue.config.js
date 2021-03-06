// @ts-check

/** @type {import("@vue/cli-service").ProjectOptions} */
module.exports = {
   lintOnSave: false,
   devServer: {
      public: "localhost:8080"
   },
   chainWebpack: config => {
      config.devtool("source-map");
   }
};
