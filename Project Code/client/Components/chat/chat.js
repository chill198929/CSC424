import React, { useContext, useEffect, useRef } from "react";
import { SettingsContext } from "../../SettingsContext";
import socketIOClient from "socket.io-client";
import "./chat.css";

export default function Chat() {
  const [settings, setSettings] = useContext(SettingsContext);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(
      "http://" + settings.url + ":" + settings.port
    );

    //use append() to add messages to chat history
    socketRef.current.on("chat_message", (msg) => {
      // if message from self
      if (msg.user_name === settings.username) {
        let newLi = document.createElement("li");
        newLi.classList.add("msg-self");
        newLi.textContent = msg.text + " :" + msg.user_name;
        document.querySelector("#messages").append(newLi);
      } else {
        // otherwise message is from someone else
        let newLi = document.createElement("li");
        newLi.classList.add("msg-other");
        newLi.textContent = msg.user_name + ": " + msg.text;
        document.querySelector("#messages").append(newLi);
      }

      // scroll chat window when msg recevied
      document.querySelector("#messages").scrollTo({
        top: document.querySelector("#messages").scrollHeight,
      });
    });

    // send username at startup
    socketRef.current.emit("username", settings.username);

    // close connection
    return () => {
      socketRef.current.disconnect();
    };
  });

  const submitChat = (e) => {
    e.preventDefault();
    if (document.querySelector("#txt").value) {
      let chat_json = {
        user_name: settings.username,
        text: document.querySelector("#txt").value,
      };
      console.log(chat_json);
      socketRef.current.emit("chat_message", chat_json);
      document.querySelector("#txt").value = "";
    }
  };

  return (
    <>
      <div class="chat-container">
        <ul id="messages"></ul>
        <form id="chatForm" onSubmit={submitChat}>
          <input
            id="txt"
            type="text"
            autoComplete="off"
            autoFocus="on"
            placeholder="Enter message..."
          />
          <button id="button">Send</button>
        </form>
      </div>
    </>
  );
}
