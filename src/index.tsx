import * as ReactDOM from "react-dom";
import * as React from "react";
import App from "./components/app";
import store from "./store";
import { Provider } from "react-redux";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("app")
  );
});
