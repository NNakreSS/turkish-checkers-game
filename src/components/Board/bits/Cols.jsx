const Cols = () => {
  // (A - H) listesini içeren içeren bir array oluşturur
  const colsArr = new Array(8)
    .fill()
    .map((x, i) => String.fromCharCode(++i + 96).toUpperCase());

  return (
    <div className="m-auto h-10 grid grid-cols-8 grid-rows-1 w-[calc(8*5rem)] text-center my-2 ml-[calc(.6*5rem)] select-none bg-orange-950 text-white font-medium">
      {colsArr.map((item, index) => (
        <div key={index} className=" flex justify-center items-center">
          {item}
        </div>
      ))}
    </div>
  );
};

export default Cols;
