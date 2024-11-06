const MyButton = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={`max-w-60 ${
        props.disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-[#a259ff]"
      } p-6 font-bold mt-8 rounded-xl transform transition-transform duration-200 hover:scale-95 hover:opacity-90 text-white`}
    >
      {props.title}
    </button>
  );
};

export default MyButton;
