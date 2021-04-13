import React, { useState, useContext, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import { SettingsContext } from "../../SettingsContext";
import "./task.css";

export default function Task() {
  const [settings, setSettings] = useContext(SettingsContext);
  const socketRef = useRef();

  const [TaskName, setTaskName] = useState("");
  const [TaskDescription, setTaskDescription] = useState("");
  const [AssignedTo, setAssignedTo] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  useEffect(() => {
    socketRef.current = socketIOClient(
      "http://" + settings.url + ":" + settings.port
    );

    // close connection
    return () => {
      socketRef.current.disconnect();
    };
  });

  const updateTaskName = (e) => {
    setTaskName(e.target.value);
  };
  const updateTaskDescription = (e) => {
    setTaskDescription(e.target.value);
  };
  const updateAssignedTo = (e) => {
    setAssignedTo(e.target.value);
  };
  const updateStartDate = (e) => {
    setStartDate(e.target.value);
  };
  const updateEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let taskState = {
      TaskNum: "",
      TaskName: TaskName,
      TaskDescription: TaskDescription,
      AssignedTo: AssignedTo,
      StartDate: StartDate,
      EndDate: EndDate,
    };
    socketRef.current.emit("task_insert", taskState);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    let deleteConfirm = confirm("Are you sure you want to DELETE this record?");
    if (deleteConfirm) {
      let taskState = {
        TaskNum: "",
        TaskName: TaskName,
        TaskDescription: TaskDescription,
        AssignedTo: AssignedTo,
        StartDate: StartDate,
        EndDate: EndDate,
      };
      socketRef.current.emit("task_delete", taskState);
    }
  };

  return (
    <>
      <form>
        <label id="taskForm">
          TaskName:
          <input
            name="TaskName"
            type="text"
            value={TaskName}
            onChange={updateTaskName}
          />
        </label>
        <br></br>

        <label id="taskForm">
          Assigned To:
          <input
            name="AssignedTo"
            type="text"
            value={AssignedTo}
            onChange={updateAssignedTo}
          />
        </label>
        <br></br>

        <label id="taskForm">
          Start Date:
          <input
            name="StartDate"
            type="date"
            value={StartDate}
            onChange={updateStartDate}
          />
        </label>
        <br></br>

        <label id="taskForm">
          End Date:
          <input
            name="EndDate"
            type="date"
            value={EndDate}
            onChange={updateEndDate}
          />
        </label>
        <br></br>

        <label id="taskForm">
          Task Description:
          <textarea
            name="TaskDescription"
            type="date"
            value={TaskDescription}
            onChange={updateTaskDescription}
          />
        </label>
        <input
          id="delete"
          type="submit"
          value="Delete"
          onClick={handleDelete}
        />
        <input
          id="submit"
          type="submit"
          value="Submit"
          onClick={handleSubmit}
        />
      </form>
    </>
  );
}
