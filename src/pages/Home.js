import { useEffect, React, useState } from "react";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// components
import TaskDetails from "../components/TaskDetails";
import TaskForm from "../components/TaskForm";
import Dropdown from "../components/Dropdown";
import NoData from "../components/NoData";

const Home = () => {
  const { tasks, dispatch } = useTaskContext();
  const { user } = useAuthContext();
  const [orderBy, setOrderBy] = useState("createdAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddTaskPopup, setIsAddTaskPopup] = useState(false);
  const [taskMode, setTaskMode] = useState(false);

  const options = [
    { value: "createdAt", label: "Recent" },
    { value: "updatedAt", label: "Last Updated" },
    { value: "deadline", label: "Deadline" },
  ];

  const handleSelect = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    setOrderBy(selectedOption.value);
  };

  const updateTaskPosition = async (taskId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ currentStatus: newStatus }),
        }
      );
      const json = await response.json();
      if (!response.ok) {
        throw new Error("Failed to update task");
      } else {
        dispatch({ type: "UPDATE_TASK", payload: json });
      }
    } catch (error) {
      throw new Error("Failed to update task");
    }
  };

  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId: taskId } = result;
    if (!destination) return;
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    if (sourceStatus !== destinationStatus) {
      let initialTaskState = tasks?.filter((task) => task._id == taskId)[0];
      let updatedTask = {
        ...initialTaskState,
        currentStatus: destinationStatus, // Update status
      };

      // Update local state optimistically
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      try {
        await updateTaskPosition(taskId, destinationStatus);
      } catch (err) {
        dispatch({ type: "UPDATE_TASK", payload: initialTaskState });
      }
    }
  };

  // ... rest of the component code

  const filterTasksByStatus = (status) => {
    return tasks?.filter((task) => task.currentStatus === status);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/tasks?orderBy=${orderBy}&searchTerm=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user, searchTerm, orderBy]);
  return (
    <>
      <div className="home">
        <button
          className="btn btn-filled btn-filled-blue add-task"
          onClick={() => setIsAddTaskPopup(true)}
        >
          Add Task
        </button>
        <div className="inner-nav">
          <div className="nav-search">
            <label htmlFor="">Search:</label>
            <input
              type="text"
              value={searchTerm}
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="">Sort By:</label>
            <Dropdown options={options} onSelect={handleSelect} />
          </div>
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="tasks-container">
            <div className="task-wrapper">
              <h3>TODO</h3>
              {tasks && tasks?.length > 0 ? (
                <Droppable droppableId="Pending">
                  {(provided) => (
                    <div
                      className="task-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filterTasksByStatus("Pending") &&
                      filterTasksByStatus("Pending")?.length > 0 ? (
                        filterTasksByStatus("Pending")?.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskDetails
                                  key={task._id}
                                  task={task}
                                  setSelectedTask={setSelectedTask}
                                  setTaskMode={setTaskMode}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <NoData />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : (
                <NoData />
              )}
            </div>

            {/* IN PROGRESS Section */}

            <div className="task-wrapper">
              <h3>IN PROGRESS</h3>
              {tasks && tasks?.length > 0 ? (
                <Droppable droppableId="In Progress">
                  {(provided) => (
                    <div
                      className="task-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filterTasksByStatus("In Progress") &&
                      filterTasksByStatus("In Progress").length > 0 ? (
                        filterTasksByStatus("In Progress")?.map(
                          (task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskDetails
                                    key={task._id}
                                    task={task}
                                    setSelectedTask={setSelectedTask}
                                    setTaskMode={setTaskMode}
                                  />
                                </div>
                              )}
                            </Draggable>
                          )
                        )
                      ) : (
                        <NoData />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : (
                <NoData />
              )}
            </div>

            {/* DONE Section */}

            <div className="task-wrapper">
              <h3>DONE</h3>
              {tasks && tasks?.length > 0 ? (
                <Droppable droppableId="Done">
                  {(provided) => (
                    <div
                      className="task-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filterTasksByStatus("Done") &&
                      filterTasksByStatus("Done")?.length > 0 ? (
                        filterTasksByStatus("Done")?.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskDetails
                                  key={task._id}
                                  task={task}
                                  setSelectedTask={setSelectedTask}
                                  setTaskMode={setTaskMode}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <NoData />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : (
                <NoData />
              )}
            </div>
          </div>
        </DragDropContext>
      </div>
      {(isAddTaskPopup || taskMode ) && (
        <TaskForm
          setIsActive={() => {
            setIsAddTaskPopup(false);
            setTaskMode(null);
          }}
          editMode={taskMode === "editMode"}
          viewMode={taskMode === "viewMode"}
          taskData={selectedTask}
        />
      )}
    </>
  );
};

export default Home;
