import { getCharFromCode } from "../../../utilities/utilitie";

const Cols = ({ array }) => {
  return (
    <div className="m-auto h-10 grid grid-cols-8 grid-rows-1 w-[calc(8*5rem)] text-center my-2 ml-[calc(.6*5rem)] select-none">
      {array.map((item, index) => (
        <div
          key={index}
          className="border  flex justify-center items-center"
        >
          {getCharFromCode(item)}
        </div>
      ))}
    </div>
  );
};

export default Cols;
