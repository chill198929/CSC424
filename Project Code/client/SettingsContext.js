import React, { useState, createContext } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = (props) => {
  const [settings, setSettings] = useState({
    username: "",
    password: "",
    url: "",
    port: "",
  });

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      {props.children}
    </SettingsContext.Provider>
  );
};
