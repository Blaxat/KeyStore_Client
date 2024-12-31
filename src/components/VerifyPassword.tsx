import { useEffect, useRef, useState } from "react";
import usePassword from "../hooks/usePassword";

const VerifyPassword = ({ 
  isModalOpen, 
  closeModal, 
  verification 
}: { 
  isModalOpen: boolean; 
  closeModal: () => void; 
  verification: (verified: boolean) => void 
}) => {
  const [err, setError] = useState("");
  const passRef = useRef<HTMLInputElement>(null);
  const { verifyPassword, error, data } = usePassword();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (error) {
      setError(error);
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      verification(true);
      closeModal();
    } 
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = passRef.current?.value;
    if (password && token) {
      setIsLoading(true);
      if (passRef.current) passRef.current.value = "";
      await verifyPassword(token, password);
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center font-[Poppins] items-center">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-[400px]">
              <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-lg">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Password</label>
                  <input
                    ref={passRef}
                    type="password"
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Enter password"
                  />
                </div>
                {err && <p className="text-red-500 text-sm mb-4">{err}</p>}
                {!isLoading && (
                  <button
                    type="submit"
                    className="w-full bg-gray-700 text-white p-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Submit
                  </button>
                )}
              </form> 
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyPassword;
