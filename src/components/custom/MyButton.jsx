const MyButton = (props) => {
  return (
    <button className="max-w-60 bg-[#a259ff] p-8 font-bold mt-8 rounded-xl transform transition-transform duration-200 hover:scale-95 hover:opacity-90 ">
      {props.title}
    </button>
  );
};

export default MyButton;
