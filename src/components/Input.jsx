import { forwardRef } from "react";

const Input = forwardRef(
  ({ type, labelName, isEditing, isTextarea, id, required, ...props }, ref) => {
    const classes = `w-full px-2 py-2 rounded-md bg-stone-100 transition-all border-2 border-stone-400 focus:bg-stone-50 ${
      type === "password" ? " passwordInput relative pr-10" : ""
    }`;

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

    function togglePassword() {
      const passwordInput = document.querySelector(".passwordInput");
      const showIcon = document.querySelector(".show");
      const hideIcon = document.querySelector(".hide");
      if (passwordInput.getAttribute("type") === "text") {
        passwordInput.setAttribute("type", "password");
        showIcon.classList.add("block");
        showIcon.classList.remove("hidden");
        hideIcon.classList.add("hidden");
        hideIcon.classList.remove("show");
      } else {
        passwordInput.setAttribute("type", "text");
        showIcon.classList.add("hidden");
        showIcon.classList.remove("block");
        hideIcon.classList.add("block");
        hideIcon.classList.remove("hidden");
      }
    }

    const defaultDateValue = isEditing?.dueDate || getCurrentDate();

    return (
      <p className="flex flex-col gap-1 my-4 relative">
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
          <input
            ref={ref}
            className={`${classes}`}
            id={id}
            type={type}
            {...props}
          />
        )}

        {type === "password" && (
          <span
            className="showHideIcon absolute right-3 cursor-pointer"
            onClick={togglePassword}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 text-stone-500 show"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 hide text-stone-500 hidden"
            >
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
          </span>
        )}
      </p>
    );
  }
);

export default Input;
