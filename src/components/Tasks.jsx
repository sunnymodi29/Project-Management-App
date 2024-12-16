import { Tooltip } from "react-tooltip";
import NewTask from "./NewTask";
import Modal from "./Modal";
import { useRef, useState } from "react";
import Input from "./Input";
import DropDown from "./DropDown";

const Tasks = ({
  onTaskAdd,
  onTaskDelete,
  onEditTask,
  tasks,
  updateTaskStatus,
}) => {
  const modal = useRef();
  const taskTitleRef = useRef();
  const [editedTaskText, setEditedTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const taskStatusList = new Map();
  taskStatusList.set("Not Selected", "bg-stone-700");
  taskStatusList.set("In Progress", "bg-blue-700");
  taskStatusList.set("Completed", "bg-green-700");
  taskStatusList.set("On Hold", "bg-red-700");

  function handleChange(event) {
    setEditedTaskText(event.target.value);
  }

  function handleTaskEdit(taskId) {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditedTaskText(taskToEdit.text);
      setEditingTaskId(taskId);
      modal.current.open();
    }
  }

  function handleSaveEditedTask() {
    onEditTask(editingTaskId, editedTaskText);
    modal.current.close();
    setEditingTaskId(null);
    setEditedTaskText("");
  }

  function toggleDropdown(taskId) {
    activeDropdownId === taskId && activeDropdownId
      ? setActiveDropdownId(null)
      : setActiveDropdownId(taskId);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Tasks</h2>
      <NewTask onAdd={onTaskAdd} />
      {tasks && tasks.length === 0 && (
        <p className="text-stone-800 my-4">
          This project does not have any tasks yet.
        </p>
      )}
      {tasks && tasks.length > 0 && (
        <ul className="p-4 mt-8 rounded-md">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="tasksAdded flex gap-2 justify-between px-2 pb-2 mb-4 border-b-2 items-center"
            >
              <Modal
                ref={modal}
                buttonCaption="Save"
                isCancel={true}
                onClick={handleSaveEditedTask}
              >
                <h2 className="text-xl font-bold text-stone-700 mb-4 pb-1 border-b-2 border-stone-300">
                  Edit Task
                </h2>
                <Input
                  type="text"
                  labelName="Edit Task Name"
                  ref={taskTitleRef}
                  isEditing={undefined}
                  placeholder="Enter Task Name"
                  value={editedTaskText}
                  onChange={handleChange}
                />
              </Modal>

              <span className="taskTitle w-10/12 truncate flex gap-3">
                <span className="truncate">{task.text}</span>
                <span
                  className={`taskStatusValue ${taskStatusList.get(
                    task.taskStatus
                  )} select-none cursor-pointer px-2 py-1 rounded-md`}
                  onClick={() => toggleDropdown(task.id)}
                >
                  <span className="block text-xs text-white font-bold">
                    {task.taskStatus}
                  </span>
                  {activeDropdownId === task.id && (
                    <DropDown
                      currentStatus={task.taskStatus}
                      isOpenDropDown={activeDropdownId === task.id}
                      setIsOpenDropDown={setActiveDropdownId}
                      onStatusChange={(newStatus) =>
                        updateTaskStatus(task.id, newStatus)
                      }
                      dropDownList={taskStatusList}
                    />
                  )}
                </span>
              </span>

              <div className="taskOptions mt-px gap-2 hidden flex">
                <span
                  className="taskEditOption cursor-pointer"
                  data-tooltip-id="taskEdit_tooltip"
                  data-tooltip-content="Edit"
                  data-tooltip-place="top"
                  onClick={() => handleTaskEdit(task.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="onNormal text-slate-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="hidden onHover text-stone-700"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
                  <Tooltip id="taskEdit_tooltip" />
                </span>
                <span
                  className="taskDeleteOption cursor-pointer"
                  data-tooltip-id="taskDelete_tooltip"
                  data-tooltip-content="Delete"
                  data-tooltip-place="top"
                  onClick={() => onTaskDelete(task.id, task.text)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 onNormal text-stone-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 hidden onHover text-stone-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Tooltip id="taskDelete_tooltip" />
                </span>
              </div>
              {/* <span
                className="taskStatusOption cursor-pointer"
                data-tooltip-id="taskStatus_tooltip"
                data-tooltip-content="Status"
                data-tooltip-place="top"
                onClick={() => toggleDropdown(task.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="onNormal text-slate-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                  />
                </svg>
                <Tooltip id="taskStatus_tooltip" />
                {activeDropdownId === task.id && (
                  <DropDown
                    currentStatus={task.taskStatus}
                    isOpenDropDown={activeDropdownId === task.id}
                    setIsOpenDropDown={setActiveDropdownId}
                    onStatusChange={(newStatus) =>
                      updateTaskStatus(task.id, newStatus)
                    }
                    dropDownList={taskStatusList}
                  />
                )}
              </span> */}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Tasks;
