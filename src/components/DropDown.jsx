import { useEffect, useRef } from "react";

const DropDown = ({
  currentStatus,
  isOpenDropDown,
  setIsOpenDropDown,
  onStatusChange,
  dropDownList,
}) => {
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenDropDown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpenDropDown]);

  const handleOptionClick = (option) => {
    if (onStatusChange) {
      onStatusChange(option);
    }
    setIsOpenDropDown(null);
  };

  return (
    <div
      className={`absolute z-10 ${isOpenDropDown ? "block" : "hidden"}`}
      ref={dropdownRef}
    >
      <ul className="dropdownContainer absolute mt-2 py-2 md:w-48 w-40 bg-white border-gray-300 rounded-md shadow-lg z-50 top-0 md:-left-2 -left-16">
        {Array.from(dropDownList.keys()).map((list) => {
          const taskStatusName = `${dropDownList.get(list)}`;
          const taskActiveClasses = `${taskStatusName} hover:${taskStatusName}  font-bold text-stone-100 border-l-2 border-s-stone-900`;

          return (
            <li
              key={list}
              className={`px-4 py-2 cursor-pointer border-l-2 border-transparent hover:border-stone-900  ${
                currentStatus === list
                  ? taskActiveClasses
                  : "hover:bg-stone-100"
              }`}
              onClick={() => handleOptionClick(list)}
            >
              {list}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropDown;
