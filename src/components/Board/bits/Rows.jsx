const Rows = () => {
  const rowsArr = new Array(8).fill().map((x, i) => 8 - i);
  return (
    <div className="grid grid-cols-1 grid-rows-8 w-10 select-none">
      {rowsArr.map((item, index) => (
        <div key={index} className="border  flex justify-center items-center">
          {item}
        </div>
      ))}
    </div>
  );
};

export default Rows;
