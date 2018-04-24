if (process.env.NODE_ENV !== "production") {
  require("./hmr");
}

import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./components/app";
import store from "./store";
import { Provider } from "react-redux";
import { ThemeProvider, theme } from "./components/styles";

import "./icomoon/style.css";
import "react-hint/css/index.css";
import "./context-menus.css";
import { actions } from "./actions";

ReactDOM.render(
  <Provider store={store as any}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("app"),
);

store.dispatch(actions.boot({}));
