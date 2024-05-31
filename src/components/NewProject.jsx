import { useRef } from "react";
import Input from "./Input";
import Modal from "./Modal";

const NewProject = ({ onAdd, onCancel }) => {
  const modal = useRef();
  const titleRef = useRef();
  const descRef = useRef();
  const dueDateRef = useRef();

  function handleSaveProject() {
    const currentTitle = titleRef.current.value;
    const currentDescription = descRef.current.value;
    const currentDueDate = dueDateRef.current.value;

    if (
      currentTitle.trim() === "" ||
      currentDescription.trim() === "" ||
      currentDueDate.trim() === ""
    ) {
      modal.current.open();
      return;
    } else {
      onAdd({
        title: currentTitle,
        description: currentDescription,
        dueDate: currentDueDate,
      });
    }
  }

  return (
    <>
      <Modal ref={modal} buttonCaption="Okay">
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
        <p className="text-stone-600 mb-4">
          Oops ... looks looks like you forgot to enter a value.
        </p>
        <p className="text-stone-600 mb-4">
          Please make sure you provide a valid for every input field.
        </p>
      </Modal>
      <div className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              className="text-stone-800 hover:text-stone-950"
              onClick={onCancel}
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950 "
              onClick={handleSaveProject}
            >
              Save
            </button>
          </li>
        </menu>
        <div>
          <Input type="text" labelName="Title" ref={titleRef} />
          <Input labelName="Description" isTextarea ref={descRef} />
          <Input type="date" labelName="Due Date" id="dateInput" ref={dueDateRef} />
        </div>
      </div>
    </>
  );
};

export default NewProject;
