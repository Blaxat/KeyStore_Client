import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import ShowMnemonics from "../components/ShowMnemonics";

const Layout = () => {
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const location = useLocation(); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsDashboard(location.pathname === "/dashboard");
  }, [location.pathname]); 

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-[Poppins]">
      <div className="flex">
        <div className={`${
            isDashboard ? "w-[85vw]" : "w-full"
          } flex flex-col`}>
          
          <div className="flex justify-between items-center text-4xl font-bold pl-2 pt-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-transparent bg-clip-text animate-fadeIn">
            <div>VaultChain</div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-lg font-semibold bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600  text-transparent bg-clip-text hover:opacity-75 focus:outline-none animate-fadeIn">
              Mnemonics
            </button>
          </div>
          
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </div>
        {isDashboard && (
          <div className="w-[15vw] bg-gradient-to-b from-gray-800 to-black shadow-lg animate-fadeIn">
            <Sidebar />
          </div>
        )}
      </div>

      <ShowMnemonics
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Layout;
