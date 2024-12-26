import { useEffect, useRef } from "react";
import Input from "./Input";
import Modal from "./Modal";
import Toastify from "./Toastify";
import Button from "./Button";

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
      // modal.current.open();
      Toastify({
        toastType: "error",
        message: "Please make sure you fill out all input fields.",
      });
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
      <div className="2xl:w-[35rem] 2xl:p-0 lg:w-[35rem] lg:p-0 md:mt-6 flex flex-col w-full px-6 mt-4">
        <div>
          <Input
            type="text"
            labelName="Title"
            isTextarea={false}
            isEditing={startEdit}
            placeholder="Enter Project Title"
            required
            ref={titleRef}
          />
          <Input
            labelName="Description"
            isTextarea
            isEditing={startEdit}
            placeholder="Enter Project Description"
            required
            ref={descRef}
          />
          <Input
            type="date"
            labelName="Due Date"
            isEditing={false}
            isTextarea={false}
            id="dateInput"
            required
            ref={dueDateRef}
          />
        </div>
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <Button onClick={onCancel} type="cancel">
              Cancel
            </Button>
          </li>
          <li>
            <Button onClick={handleSaveProject} type="save">
              Save
            </Button>
          </li>
        </menu>
      </div>
    </>
  );
};

export default NewProject;
