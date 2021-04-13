import React, { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { SettingsContext } from "../../SettingsContext";
import Column from "./column";
import "./board.css";

export default function Board() {
  const [settings, setSettings] = useContext(SettingsContext);
  const [columnsArray, setColumnsArray] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(
      "http://" + settings.url + ":" + settings.port
    );

    socketRef.current.emit("column_pull");

    socketRef.current.on("column_record", (record) => {
      setColumnsArray((columnsArray) => [...columnsArray, record]);
    });

    // close connection
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const addColumn = (e) => {
    e.preventDefault();
    console.log("inside addColumn");
    const newCol = {
      column_id: columnsArray.length + 1,
      column_name: "New Column",
    };
    setColumnsArray((columnsArray) => [...columnsArray, newCol]);
    socketRef.current.emit("column_insert", newCol);
  };

  return (
    <>
      <div class="column-container">
        {columnsArray
          ? columnsArray.map((column) => (
              <Column key={column.id} column={column} />
            ))
          : "Loading..."}
      </div>
      <button id="addcol" onClick={addColumn}>
        <span>&#43;</span>
      </button>
    </>
  );
}
