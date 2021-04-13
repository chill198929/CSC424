import React, { useState, useContext, useEffect } from "react";
import { SettingsContext } from "../../SettingsContext";
import "./settings.css";

// Do not delete or move this line or the page will refresh endlessly
let settingsUpdate = false;

export default function Settings() {
  const [settings, setSettings] = useContext(SettingsContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [port, setPort] = useState("");

  useEffect(() => {
    if (settingsUpdate) {
      fetch("http://localhost:3000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      settingsUpdate = false;
    }
  });

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };
  const updateUrl = (e) => {
    setUrl(e.target.value);
  };
  const updatePort = (e) => {
    setPort(e.target.value);
  };

  const saveSettings = (e) => {
    e.preventDefault();
    setSettings({
      username: username,
      password: password,
      url: url,
      port: port,
    });
    settingsUpdate = true;
  };

  return (
    <>
      <form id="settingContainer" onSubmit={saveSettings}>
        <label id="settingsForm">
          Username:
          <input
            name="username"
            type="text"
            placeholder={settings.username}
            onChange={updateUsername}
          />
        </label>
        <br></br>

        <label id="settingsForm">
          Password:
          <input
            name="password"
            type="text"
            placeholder={settings.password}
            onChange={updatePassword}
          />
        </label>
        <br></br>

        <label id="settingsForm">
          Server URL:
          <input
            name="dbWeb"
            type="text"
            placeholder={settings.url}
            onChange={updateUrl}
          />
        </label>
        <br></br>

        <label id="settingsForm">
          Server Port:
          <input
            name="dbPort"
            type="text"
            placeholder={settings.port}
            onChange={updatePort}
          />
        </label>
        <input id="submitButton" type="submit" value="Submit" />
      </form>
      <br></br>
    </>
  );
}
