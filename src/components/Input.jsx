import { forwardRef } from "react";

const Input = forwardRef(
  ({ labelName, id, isTextarea = false, ...props }, ref) => {
    const classes =
      "w-full p-1 border-b-2 rounded-sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-600";

    function handleSelectionDates() {
      var todayDate = new Date();
      var month = todayDate.getMonth() + 1;
      var date = todayDate.getDate();
      var year = todayDate.getFullYear();
      month < 10 ? (month = "0" + month.toString()) : (month = month);
      date < 10 ? (date = "0" + date.toString()) : (date = date);
      var maxDate = year + "-" + month + "-" + date;

      if (id !== undefined) {
        document.getElementById(id).setAttribute("min", maxDate);
        document.getElementById(id).value = maxDate;
      }
    }

    setTimeout(() => {
      handleSelectionDates();
    }, 10);

    return (
      <p className="flex flex-col gap-1 my-4">
        <label className="text-sm font-bold uppercase text-stone-500">
          {labelName}
        </label>
        {isTextarea ? (
          <textarea ref={ref} className={classes} {...props} />
        ) : (
          <input ref={ref} className={classes} id={id} {...props} />
        )}
      </p>
    );
  }
);

export default Input;
