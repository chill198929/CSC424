// Load environmental variables
require("dotenv").config();

// Required packages
const express = require('express');

// Set express and configure middleware
const exp = express();
exp.use(express.json());

// Create http server, depedent on express server
const http = require('http').Server(exp);

// Create socket, dependent on http server
const io = require('socket.io')(http);
const mysql = require('mysql');

// Configure DB connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, // enter IP of DB here
  port: process.env.DB_PORT, // specify port
  user: process.env.DB_USER, // DB username
  password: process.env.DB_PASS, // DB password
  database: process.env.DB_TABLE, // target schema
});

// Configure socket and events
io.sockets.on("connection", (socket) => {
  socket.on("username", () => {
    pullChatHistory(socket);
  });

  socket.on("chat_message", (message) => {
    pushChatMessage(message);
    io.emit("chat_message", message);
  });

  // COLUMNS EVENTS
  socket.on("column_pull", () => {
    pullColumnNames(socket);
  });

  socket.on("column_insert", (record) => {
    insertColumnRecord(record);
    io.emit("column_record", record);
  });

  socket.on("column_update", (record) => {
    updateColumnRecord(record);
  });

  socket.on("column_delete", (record) => {
    deleteColumnRecord(record);
  });

  // TASK EVENTS
  socket.on("task_pull", () => {
    pullTaskHistory(socket);
  });

  socket.on("task_insert", (record) => {
    insertTaskRecord(record);
    io.emit("task_record", record);
  });

  socket.on("task_update", (record) => {
    updateTaskRecord(record);
  });

  socket.on("task_delete", (record) => {
    deleteTaskRecord(record);
  });
});

// Configure listen port for socket connections
const server = http.listen(22446, () => {
    console.log('listening on *:22446');
});

// Pull full chat history on initial connection to chatroom
function pullChatHistory(socket) {
  // prepare query
  const sql =
    "SELECT * FROM message JOIN user ON message.sender_id=user.user_id ORDER BY created_at;";

    // run query
    pool.query(sql, (err, res) => {
        if (err) {
            // handle error
            console.error('Error with query: ' + err.stack);
        } else {
            // emit each message one JSON at a time
            res.forEach((row) => {
                socket.emit('chat_message', row);
            });
        }
    });
}

// Insert new chat message into DB
function pushChatMessage(message) {
  // prepare query
  let sql = `INSERT INTO message SET
                sender_id = (SELECT user_id FROM user WHERE user_name = ${mysql.escape(
                  message.user_name
                )}),
                text = ${mysql.escape(message.text)},
                room_name = ${mysql.escape("alfas")}`;

  // run query
  pool.query(sql, (err) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    }
  });
}

// Pull full task history on initial connection to chatroom
function pullTaskHistory(socket) {
  // prepare query
  const sql = "SELECT * FROM task";

  // run query
  pool.query(sql, (err, res) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    } else {
      // emit each message one JSON at a time
      res.forEach((row) => {
        socket.emit("task_record", row);
      });
    }
  });
}

// Insert new task record into DB
function insertTaskRecord(record) {
  // prepare query
  let sql = `INSERT INTO task SET
              task_name = ${mysql.escape(record.TaskName)},
              task_number = ${mysql.escape(record.TaskNum)},
              user_id = (SELECT user_id FROM user WHERE user_name = ${mysql.escape(
                record.AssignedTo
              )}),
              description = ${mysql.escape(record.TaskDescription)},
              date_start = ${mysql.escape(record.StartDate)},
              date_end = ${mysql.escape(record.EndDate)}`;

  // run query
  pool.query(sql, (err) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    }
  });
}

// Function to update individual task record
function updateTaskRecord(record) {
  // prepare query
  let sql = `UPDATE task SET
              task_name = ${mysql.escape(record.TaskName)},
              task_number = ${mysql.escape(record.TaskNum)},
              user_id = (SELECT user_id FROM user WHERE user_name = ${mysql.escape(
                record.AssignedTo
              )}),
              description = ${mysql.escape(record.TaskDescription)},
              date_start = ${mysql.escape(record.StartDate)},
              date_end = ${mysql.escape(record.EndDate)}
              WHERE
              task_id = ${mysql.escape(record.task_id)}`;

  // run query
  pool.query(sql, (err) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    }
  });
}

// Delete individual task record
function deleteTaskRecord(record) {
  // prep query
  let sql = `DELETE FROM task WHERE task_id = ${mysql.escape(record.task_id)}`;

  // run query
  pool.query(sql, (err) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    }
  });
}

// Pull columns names
function pullColumnNames(socket) {
  // prep query
  let sql = "SELECT * FROM columns";

  // run query
  pool.query(sql, (err, res) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    } else {
      // emit each message one JSON at a time
      res.forEach((row) => {
        socket.emit("column_record", row);
      });
    }
  });
}

// Insert new task record into DB
function insertColumnRecord(record) {
  // prepare query
  let sql = `INSERT INTO columns SET
              column_name = ${mysql.escape(record.column_name)}`;

  // run query
  pool.query(sql, (err) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    }
  });
}

// Function to update individual task record
function updateColumnRecord(record) {
  // prepare query
  let sql = `UPDATE columns SET
              column_name = ${mysql.escape(record.column_name)}`;

  // run query
  pool.query(sql, (err) => {
    if (err) {
      // handle error
      console.error("Error with query: " + err.stack);
    }
  });
}

// Delete individual task record
function deleteColumnRecord(record) {
  // prep query
  let sql = `DELETE FROM columns WHERE column_id = ${mysql.escape(
    record.column_id
  )}`;

    // run query
    pool.query(sql, (err) => {
        if (err) {
            // handle error
            console.error('Error with query: ' + err.stack);
        }
    });    
}