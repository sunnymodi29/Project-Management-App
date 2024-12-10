import { forwardRef } from "react";

const Input = forwardRef(
  ({ labelName, id, isTextarea = false, isEditing, ...props }, ref) => {
    // const classes = "w-full p-1 border-b-2 rounded-sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-600";

    const classes = "addNewTaskInput w-full px-2 py-2 rounded-md bg-stone-100 transition-all border-2 border-stone-400 focus:bg-stone-50"

    function getCurrentDate() {
      const todayDate = new Date();
      const month = todayDate.getMonth() + 1;
      const date = todayDate.getDate();
      const year = todayDate.getFullYear();
      return `${year}-${month < 10 ? "0" + month : month}-${
        date < 10 ? "0" + date : date
      }`;
    }

    const defaultDateValue = isEditing?.dueDate || getCurrentDate();

    return (
      <p className="flex flex-col gap-1 my-4">
        <label className="text-sm font-bold uppercase text-stone-500">
          {labelName}
        </label>
        {isTextarea ? (
          <textarea ref={ref} className={classes} {...props} />
        ) : (
          <input
            ref={ref}
            className={classes}
            id={id}
            {...props}
            defaultValue={defaultDateValue}
            min={getCurrentDate()}
          />
        )}
      </p>
    );
  }
);

export default Input;
