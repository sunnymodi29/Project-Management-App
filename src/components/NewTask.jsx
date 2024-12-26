import { useState } from "react";
import Button from "./Button";

const NewTask = ({ onAdd }) => {
  const [enteredTask, setEnteredTask] = useState("");

  function handleChange(event) {
    setEnteredTask(event.target.value);
  }

  function handleClick() {
    onAdd(enteredTask);
    setEnteredTask("");
  }

  return (
    <div className="newTaskSection flex items-center justify-between gap-3 lg:w-96">
      <div className="flex gap-3 items-center justify-between w-9/12">
        <input
          type="text"
          className="addNewTaskInput w-full px-2 py-2 rounded-md bg-stone-100 transition-all border-2 border-stone-400 focus:bg-stone-50"
          placeholder="Enter Task Name"
          value={enteredTask}
          onChange={handleChange}
        />
      </div>
      <Button
        onClick={handleClick}
        type="save"
        additionalClasses="whitespace-nowrap"
      >
        Add New Task
      </Button>
    </div>
  );
};

export default NewTask;
