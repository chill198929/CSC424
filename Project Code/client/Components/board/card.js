import React from "react";
import "./board.css";

export default function Card(fromColumn) {
  return (
    <div class="taskcard" draggable="true">
      <h2>{fromColumn.card.task_name}</h2>
      <h4>{fromColumn.card.description}</h4>
      <h5>TASK00000{fromColumn.card.task_id}</h5>
    </div>
  );
}
