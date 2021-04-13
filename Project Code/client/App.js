import React from "react";
import Main from "../client/Components/Main/Main";
import { HashRouter } from "react-router-dom";
import { SettingsProvider } from "./SettingsContext";

export default function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <div className="App">
          <Main />
        </div>
      </HashRouter>
    </SettingsProvider>
  );
}
