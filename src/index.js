import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from './serviceWorker';

import App from "./App/App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);

serviceWorker.unregister();