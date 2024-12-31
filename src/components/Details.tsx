import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa';

const Details = ({
  publicKey,
  privateKey,
  onShowModal,
  showSecret,
}: {
  publicKey: string;
  privateKey: string;
  onShowModal: () => void;
  showSecret: boolean;
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col p-6 w-[30vw] border border-gray-700 rounded-lg shadow-md bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white font-[Poppins]">
      <h2 className="text-xl font-semibold text-gray-300 mb-3">Address:</h2>
      <div className="relative mb-3">
        <input
          type="text"
          value={publicKey}
          readOnly
          className="p-3 w-full border rounded-md text-gray-400 bg-gray-700 pr-12 text-base"
        />
        <button
          type="button"
          onClick={() => copyToClipboard(publicKey)}
          className="absolute right-3 top-3 text-gray-400 hover:text-white text-lg"
        >
          <FaCopy />
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-300 mb-3">Secret:</h2>
      <div className="relative">
        <input
          type={showSecret ? "text" : "password"}
          value={privateKey}
          readOnly
          className="p-3 w-full border rounded-md text-gray-400 bg-gray-700 pr-12 text-base"
        />
        <button
          type="button"
          onClick={onShowModal}
          className="absolute right-3 top-3 text-gray-400 hover:text-white text-lg"
        >
          {showSecret ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default Details;

