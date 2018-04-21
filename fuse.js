const {
  FuseBox,
  WebIndexPlugin,
  CSSResourcePlugin,
  CSSPlugin
} = require("fuse-box");
const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
  plugins: [
    WebIndexPlugin({
      template: "index.template.html"
    }),
    [
      CSSResourcePlugin({
        inline: true
      }),
      CSSPlugin()
    ]
  ]
});
fuse.dev(); // launch http server
fuse
  .bundle("app")
  .instructions(" > index.tsx")
  .hmr()
  .watch();
fuse.run();
