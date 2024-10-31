const MyButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="max-w-60 bg-[#a259ff] p-6 font-bold mt-8 rounded-xl transform transition-transform duration-200 hover:scale-95 hover:opacity-90 "
    >
      {props.title}
    </button>
  );
};

export default MyButton;
