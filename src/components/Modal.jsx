import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const Modal = forwardRef(
  ({ children, buttonCaption, isCancel, ...props }, ref) => {
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

    return createPortal(
      <dialog
        ref={dialog}
        className="backdrop:bg-stone-900/90 p-5 rounded-md shadow-md"
      >
        {children}
        <form method="dialog" className="mt-4 text-right">
          <span
            className="flex justify-end gap-3
          "
          >
            {isCancel && <Button type="cancel">Cancel</Button>}
            <Button type="save" {...props}>
              {buttonCaption}
            </Button>
          </span>
        </form>
      </dialog>,
      document.getElementById("modal-root")
    );
  }
);

export default Modal;
