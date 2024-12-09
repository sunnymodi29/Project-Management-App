import { useEffect, useRef } from "react";
import Input from "./Input";
import Modal from "./Modal";

const NewProject = ({ onAdd, onCancel, onEdit, startEdit }) => {
  const modal = useRef();
  const titleRef = useRef();
  const descRef = useRef();
  const dueDateRef = useRef();

  function formatDate(date) {
    if (!date) return "";
    const validDate = new Date(date);
    if (isNaN(validDate)) return "";
    return validDate.toISOString().split("T")[0];
  }

  useEffect(() => {
    if (startEdit) {
      titleRef.current.value = startEdit.title || "";
      descRef.current.value = startEdit.description || "";
      const formattedDate = formatDate(startEdit.dueDate || "");
      dueDateRef.current.value = formattedDate || "";
    } else {
      titleRef.current.value = "";
      descRef.current.value = "";
      dueDateRef.current.value = "";
    }
  }, [startEdit]);

  function handleSaveProject() {
    const currentTitle = titleRef.current.value;
    const currentDescription = descRef.current.value;
    const currentDueDate =
      dueDateRef.current.value !== ""
        ? dueDateRef.current.value
        : dueDateRef.current.defaultValue;

    if (
      currentTitle.trim() === "" ||
      currentDescription.trim() === "" ||
      currentDueDate.trim() === ""
    ) {
      modal.current.open();
      return;
    }

    const projectData = {
      title: currentTitle,
      description: currentDescription,
      dueDate: currentDueDate,
    };

    if (startEdit) {
      onEdit(projectData, startEdit.id);
    } else {
      onAdd(projectData);
    }
  }

  return (
    <>
      <Modal ref={modal} buttonCaption="Okay">
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
        <p className="text-stone-600 mb-4">
          Please make sure you fill out all input fields.
        </p>
      </Modal>
      <div className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              className="text-stone-800 delay-75 hover:text-white hover:bg-stone-700 px-6 rounded-md border-2 border-gray-900 h-9"
              onClick={onCancel}
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              className="px-6 py-1 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950 h-9"
              onClick={handleSaveProject}
            >
              Save
            </button>
          </li>
        </menu>
        <div>
          <Input
            type="text"
            labelName="Title"
            ref={titleRef}
            isEditing={startEdit}
          />
          <Input
            labelName="Description"
            isTextarea
            ref={descRef}
            isEditing={startEdit}
          />
          <Input
            type="date"
            labelName="Due Date"
            id="dateInput"
            ref={dueDateRef}
          />
        </div>
      </div>
    </>
  );
};

export default NewProject;
