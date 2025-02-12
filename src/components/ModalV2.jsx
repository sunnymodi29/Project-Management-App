import { forwardRef, useImperativeHandle, useRef } from "react";
import Button from "./Button";

const Modal = forwardRef(
  (
    {
      headingText,
      children,
      buttonCaption,
      isCancel,
      headerAdditionClasses,
      ...props
    },
    ref
  ) => {
    const dialog = useRef();
    useImperativeHandle(ref, () => {
      return {
        open() {
          dialog.current.showModal();
        },
        close() {
          dialog.current.close();
        },
      };
    });

    function handleCloseModal() {
      dialog.current.close();
      document.body.style.overflow = "auto";
    }

    return (
      <dialog
        ref={dialog}
        className="backdrop:bg-stone-900/90 rounded-md shadow-md modalv2"
      >
        <h2
          className={`text-xl font-bold text-stone-700 border-b-2 border-stone-300 px-5 py-3 flex justify-between items-center ${headerAdditionClasses}`}
        >
          <span>{headingText}</span>
          <span
            className="cursor-pointer rounded-full text-lg py-0.5 px-2.5 bg-stone-200 hover:bg-stone-300 transition-all"
            onClick={handleCloseModal}
            title="Cancel"
          >
            X
          </span>
        </h2>
        <section className="contentWrapper px-5 overflow-hidden overflow-y-auto">
          {children}
        </section>
        <form
          method="dialog"
          className="text-right px-5 border-t-2 border-stone-300 p-3"
        >
          <section
            className="flex justify-end gap-3
          "
          >
            {isCancel && (
              <Button
                type="cancel"
                additionalClasses="h-9 py-0"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            )}
            <Button additionalClasses="h-9 py-0 px-4" {...props}>
              {buttonCaption}
            </Button>
          </section>
        </form>
      </dialog>
    );
  }
);

export default Modal;
