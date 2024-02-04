const Rows = () => {
  const rowsArr = new Array(8).fill().map((x, i) => 8 - i);
  return (
    <div className="grid grid-cols-1 grid-rows-8 w-full select-none bg-orange-950 text-white font-medium">
      {rowsArr.map((item, index) => (
        <div key={index} className="flex justify-center items-center">
          {item}
        </div>
      ))}
    </div>
  );
};

export default Rows;
