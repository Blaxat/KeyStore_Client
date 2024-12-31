const Mnemonics = ({ text }: { text: string }) => {
  return (
    <div>
      <button
        type="button"
        className="text-white bg-gradient-to-br from-gray-800 to-gray-700 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-gray-600 dark:focus:ring-gray-800 font-[Poppins] rounded-lg text-sm w-[100px] py-2 me-2 mb-2"
      >
        {text}
      </button>
    </div>
  );
};

export default Mnemonics;
