import { forwardRef } from "react";

const Input = forwardRef(
  ({ type, labelName, isEditing, isTextarea, id, required, ...props }, ref) => {
    const classes =
      "addNewTaskInput w-full px-2 py-2 rounded-md bg-stone-100 transition-all border-2 border-stone-400 focus:bg-stone-50";

    const getCurrentDate = () => {
      const today = new Date();
      // const month = todayDate.getMonth() + 1;
      // const date = todayDate.getDate();
      // const year = todayDate.getFullYear();
      // return `${year}-${month < 10 ? "0" + month : month}-${
      //   date < 10 ? "0" + date : date
      // }`;
      return today.toISOString().split("T")[0];
    };

    const defaultDateValue = isEditing?.dueDate || getCurrentDate();

    return (
      <p className="flex flex-col gap-1 my-4">
        <label
          className="text-sm font-bold uppercase text-stone-500"
          htmlFor={id}
        >
          {labelName} {required && <span className="text-red-500">*</span>}
        </label>

        {isTextarea ? (
          <textarea ref={ref} className={classes} id={id} {...props} />
        ) : type === "date" ? (
          <input
            ref={ref}
            className={classes}
            id={id}
            type={type}
            defaultValue={defaultDateValue}
            min={getCurrentDate()}
            {...props}
          />
        ) : (
          <input ref={ref} className={classes} id={id} {...props} />
        )}
      </p>
    );
  }
);

export default Input;
