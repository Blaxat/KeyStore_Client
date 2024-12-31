import { useEffect, useState } from "react";
import Create from "../components/modal/Create";
import Import from "../components/modal/Import";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  return (
    <div className="h-[91vh] w-screen flex justify-center items-center bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-[Poppins]">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-4xl font-bold mb-8 tracking-wider animate-fadeIn">
          A Crypto Wallet
        </h1>
        <button
          type="button"
          onClick={() => setIsModal2Open(true)}
          className="relative inline-block px-8 py-3 font-medium text-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-lg shadow-lg group hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500 transition-transform transform hover:-translate-y-1 animate-fadeIn"
        >
          <span className="absolute inset-0 w-full h-full transition-opacity opacity-50 bg-gradient-to-r from-green-400 via-green-500 to-green-600 group-hover:opacity-75 rounded-lg"></span>
          <span className="relative z-10">Import Existing Wallet</span>
        </button>
        <button
          type="button"
          onClick={() => setIsModal1Open(true)}
          className="relative inline-block px-8 py-3 font-medium text-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 rounded-lg shadow-lg group hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500 transition-transform transform hover:-translate-y-1 animate-fadeIn delay-200"
        >
          <span className="absolute inset-0 w-full h-full transition-opacity opacity-50 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 group-hover:opacity-75 rounded-lg"></span>
          <span className="relative z-10">Create New Wallet</span>
        </button>
      </div>
      <Create isModalOpen={isModal1Open} closeModal={() => setIsModal1Open(false)} />
      <Import isModalOpen={isModal2Open} closeModal={() => setIsModal2Open(false)} />
    </div>
  );
};

export default Home;