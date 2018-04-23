declare var FuseBox: any;

const customizedHMRPlugin = {
  hmrUpdate: ({ type, path, content, dependants }) => {
    if (type === "js") {
      FuseBox.flush(file => {
        if (/store/.test(file)) {
          return false;
        }
        return true;
      });
      FuseBox.dynamic(path, content);
      if (FuseBox.mainFile) {
        FuseBox.import(FuseBox.mainFile);
      }
      return true;
    }
  },
};

let alreadyRegistered = false;
if (!(window as any).hmrRegistered) {
  (window as any).hmrRegistered = true;
  FuseBox.addPlugin(customizedHMRPlugin);
}
