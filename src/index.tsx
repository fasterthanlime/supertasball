import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./components/app";
import store from "./store";
import { Provider } from "react-redux";
import { ThemeProvider, theme } from "./components/styles";

import "./icomoon/style.css";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>,
    document.getElementById("app")
  );
});
