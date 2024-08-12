import React from "react";
import ReactDOM from "react-dom";
import "react-virtualized/styles.css";
import "./index.css";
import "./react-modal.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as WebFont from "webfontloader";
import "./locales/i18n";

WebFont.load({
  google: {
    families: ["Play"],
  },
});

function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
}

window.addEventListener("resize", appHeight);
appHeight();

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
