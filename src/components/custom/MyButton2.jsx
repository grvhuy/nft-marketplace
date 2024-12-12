const MyButton2 = (props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className="cursor-pointer font-bold max-w-60 bg-[#a368f0] px-4 py-2 text-white rounded-sm transform transition-transform duration-200 hover:scale-98 hover:opacity-90 "
    >
      {props.title}
    </button>
  );
};

export default MyButton2;
