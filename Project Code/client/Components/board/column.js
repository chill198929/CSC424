import React, { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { SettingsContext } from "../../SettingsContext";
import Card from "./card";
import "./board.css";

export default function Column(fromBoard) {
  const [settings, setSettings] = useContext(SettingsContext);
  const [cardsArray, setCardsArray] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(
      "http://" + settings.url + ":" + settings.port
    );

    socketRef.current.emit("task_pull");

    socketRef.current.on("task_record", (record) => {
      if (record.column_id === fromBoard.column.column_id) {
        setCardsArray((cardsArray) => [...cardsArray, record]);
      }
    });

    // close connection
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const updateColumnName = (e) => {
    console.log("We made it!");
    let colParent = document.querySelector(".column").closest(".near.ancestor");
    console.log(colParent);
    colParent = colParent.id.slice(3, 4);
    console.log(colParent);
    colRecord = {
      column_id: colParent,
      column_name: e.target.value,
    };
    console.log(colRecord);
    socketRef.current.emit("column_update", colRecord);
    console.log(socketRef.current);
  };

  let columnId = "col" + fromBoard.column.column_id;
  let formId = "form-" + columnId;
  return (
    <div class="column" id={columnId}>
      <form class="columnNameForm" id={formId} onSubmit={updateColumnName}>
        <input
          class="columnNameInput"
          type="text"
          placeholder={fromBoard.column.column_name}
        ></input>
        <input class="hideme" type="submit"></input>
      </form>
      {cardsArray
        ? cardsArray.map((card) => <Card key={card.task_id} card={card} />)
        : "Loading..."}
    </div>
  );
}
