"use client";
import React, { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import { checkIndexedDB } from "../../../lib/checkIndexedDB";
import { useDB } from "../../../../Context/IPDBContext";
// Define the TaskManager component
const TaskManager = () => {
  const { db } = useDB();

  useEffect(() => {
    // db.testQuery().then((result) => {
    //   console.log(result);
    // })
  }, [])

  // Render the component
  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Task Manager</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter new task"
          style={{ padding: "5px", width: "100%" }}
        />
        <button onClick={addTask} style={{ marginTop: "10px", width: "100%" }}>
          Add Task
        </button>
      </div>

      <h3>Tasks</h3>
      <ul style={{ paddingLeft: "20px" }}>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.id}. {task.task}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
