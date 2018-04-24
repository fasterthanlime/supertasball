const {
  FuseBox,
  WebIndexPlugin,
  CSSResourcePlugin,
  CSSPlugin,
  QuantumPlugin,
  RawPlugin,
  CopyPlugin,
} = require("fuse-box");

let isProduction = false;
if (process.env.NODE_ENV === "production") {
  isProduction = true;
}

const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
  hash: isProduction,
  plugins: [
    WebIndexPlugin({
      template: "index.template.html",
      pre: { relType: "load" },
    }),
    [
      CSSResourcePlugin({
        inline: true,
      }),
      CSSPlugin(),
    ],
    RawPlugin(["maps/*.svg"]),
    CopyPlugin({
      files: ["tracks/*.xm"],
    }),
    isProduction &&
      QuantumPlugin({
        uglify: true,
        treeshake: true,
        bakeApiIntoBundle: "app",
      }),
  ],
});

if (!isProduction) {
  fuse.dev(); // launch http server
}

const bundle = fuse.bundle("app").instructions(" > index.tsx");
if (!isProduction) {
  bundle.hmr().watch();
}
fuse.run();
