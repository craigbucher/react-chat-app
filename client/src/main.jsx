import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/state/api";

// configure redux store:
export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },  // standard redux setup command
  middleware: (getDefault) => getDefault().concat(api.middleware),  // use api middleware
});
setupListeners(store.dispatch); // dispatch = trigger a state change

// Configure <App> to use redux:
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
