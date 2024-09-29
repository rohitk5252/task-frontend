import React from "react";
import { useTaskContext } from "../hooks/useTaskContext";
// Date FNS to format date time
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";
import moment from "moment";
import edit from "../assets/svg/edit.svg";
import eye from "../assets/svg/eye.svg";
import trash from "../assets/svg/trash.svg";

const TaskDetails = ({ task, setSelectedTask, setTaskMode }) => {
  const { dispatch } = useTaskContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/tasks/${task._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_TASK", payload: json });
    }
  };

  const handleEdit = async () => {
    setTaskMode("editMode");
    setSelectedTask(task);
  };
  const handleView = async () => {
    setTaskMode("viewMode");
    setSelectedTask(task);
  };

  return (
    <div className="task-details">
      <div className="task-title">
      <h4>{task?.title.substring(0, Math.min(20, task?.title.length))}  {task?.title.length > 20  ? "....." : null} {moment(`${task?.dueDate.split('T')[0]} ${task?.dueTime}`).isBefore(moment()) && task?.currentStatus != 'Done' && <span className='ytagYellow'> Task Overdue </span>}</h4>
      <img className="action" src={edit} alt="edit" onClick={handleEdit}/>
      </div>
      <p>
        <strong>Note:</strong> {task?.note.substring(0, Math.min(70, task?.note.length))}  {task?.note.length > 70  ? "....." : null}
      </p>
      
      <p className="timestamp">
        <strong>Due:</strong>{" "}
        {task?.dueDate
          ? moment(`${task?.dueDate.split('T')[0]} ${task?.dueTime}`).format('YYYY-MM-DD HH:mm')
          : "N/A"}
      </p>
      <p className="">
        <strong>Added:</strong>{" "}
        {formatDistanceToNow(new Date(task?.createdAt), { addSuffix: true })}
      </p>
      <div className="task-details-action">
        <img  className="action" src={trash} alt="Delete" onClick={handleDelete} />

        <img  className="action" src={eye} alt="View Details" onClick={handleView} />
      </div>
    </div>
  );
};

export default TaskDetails;
