import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from './app/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>

);
