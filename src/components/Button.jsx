const Button = ({ children, type, additionalClasses, ...props }) => {
  let button;
  if (type === "normal" || type === "save") {
    button = (
      <button
        className={`px-4 py-2 text-xs md:text-base rounded-md bg-stone-700 hover:bg-stone-900 text-white transition-all ${additionalClasses}`}
        {...props}
      >
        {children}
      </button>
    );
  } else if (type === "cancel") {
    button = (
      <button
        className={`text-stone-800 delay-75 hover:text-white hover:bg-stone-700 px-6 rounded-md border-2 border-gray-900 h-10 hover:border-stone-700 transition-all ${additionalClasses}`}
        {...props}
      >
        {children}
      </button>
    );
  } else {
    button = (
      <button
        className={`px-4 py-2 text-xs md:text-base rounded-md bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-100 transition-all  ${additionalClasses}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return button;
};

export default Button;
