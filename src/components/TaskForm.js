import React, { useEffect, useState } from "react";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";

const TaskForm = ({ isActive, setIsActive, editMode, taskData, viewMode }) => {
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { dispatch } = useTaskContext();
  const { user } = useAuthContext();

  const [postData, setPostData] = useState({
    title: "",
    note: "",
    dueDate: "",
    dueTime: ""
  });

  const onChangeInput = (e, type) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      // console.log(json.error);
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_TASK", payload: json });
      // console.log("New Task Added");
      setIsActive(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/tasks/${taskData?._id}`,
      {
        method: "PATCH",
        body: JSON.stringify(postData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      // console.log(json.error);
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "UPDATE_TASK", payload: json });
      // console.log("New Task Added");
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (editMode || viewMode) {
      setPostData(taskData);
    }
  }, [editMode, viewMode]);
  // console.log("taskData", taskData);

  return (
    <div className="task-modal">
      <div className="task-container">
        <h2>{editMode ? `Edit Task` : `Add New Task`}</h2>
        <form>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              onChange={onChangeInput}
              value={postData?.title}
              disabled={viewMode}
              className={emptyFields.includes("title") ? "error" : ""}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              type="text"
              name="note"
              onChange={onChangeInput}
              value={postData?.note}
              disabled={viewMode}
              className={emptyFields.includes("note") ? "error" : ""}
            />
          </div>
          <div>
            <label>Due Date :</label>
            <input
              type="date"
              name="dueDate"
              onChange={onChangeInput}
              disabled={viewMode}
              value={postData?.dueDate ? new Date(postData?.dueDate).toISOString().split('T')[0] : ""}
              className={emptyFields.includes("dueDate") ? "error" : ""}
            />
          </div>
          <div>
            <label>Due Time :</label>
            <input
              type="time"
              name="dueTime"
              onChange={onChangeInput}
              disabled={viewMode}
              value={postData?.dueTime}
              className={emptyFields.includes("dueTime") ? "error" : ""}
            />
          </div>
        </form>
        <div className="task-footer">
          {!viewMode && <button className="btn btn-filled btn-filled-blue" onClick={editMode ? handleUpdate : handleSubmit}>
            {editMode ? `Edit Task` : `Add Task`}
          </button>}
          <button className="btn btn-filled p-0" onClick={() => setIsActive(false)}>
            Close
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
