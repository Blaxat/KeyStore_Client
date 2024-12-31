import { useEffect, useRef, useState } from "react";
import Password from "../Password";
import useCreateWallet from "../../hooks/useCreateWallet";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Import = ({
  isModalOpen
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const mnemonicRefs = useRef<HTMLInputElement[]>([]);
  const [renderForm, setRenderForm] = useState<boolean>(false);
  const [words24, setWords24] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [mnemonicPhrase, setmnemonicPhrase] = useState<string>('');
  const { createWallet, isLoading, error, data } = useCreateWallet();
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mnemonicPhrase && password) {
      createWallet(mnemonicPhrase, password, false); 
    }
  }, [mnemonicPhrase, password]);

  useEffect(() => {
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setErr(error);
      setToastOpen(true); // Show toast when error exists
      console.error(error);
    }
  }, [error]);

  const handleSubmit = () => {
    const mnemonics = mnemonicRefs.current.map(
      (input) => input?.value.trim() || ""
    );
    const mnemonicPhrase = mnemonics.join(" ");
    if (mnemonics.every((word) => word !== "") && (words24 ? mnemonics.length === 24 : mnemonics.length === 12)) {
      console.log(`Mnemonic phrase submitted: ${mnemonicPhrase}`);
      setmnemonicPhrase(mnemonicPhrase);
      setRenderForm(true);
    } else {
      setErr("Please ensure all mnemonic fields are filled correctly.");
      setToastOpen(true);
    }    
    mnemonicRefs.current.forEach((input) => {
      if (input) input.value = "";
    });
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <div>
      {isModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-[400px]">
            {!renderForm ? (
              <>
                <div className="p-2 flex flex-wrap justify-evenly">
                  {Array.from(words24 ? { length: 24 } : { length: 12 }).map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (mnemonicRefs.current[index] = el!)}
                      type="text"
                      className="text-center border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-lg text-sm w-[90px] py-2 mb-2 mx-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder={`Word ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center text-sm mt-4">
                <label className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-pink-500" 
                    onChange={() => setWords24(!words24)}
                  />
                  <span className="text-base">24 words</span>
                </label>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <button
                    onClick={handleSubmit}
                    className="text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm px-4 py-2 mx-2"
                  >
                    Verify Secret Recovery Phrase
                  </button>
                </div>
              </>
            ) : (
              <Password loading={isLoading} err={error} getPassword={(value: string) => setPassword(value)}/>
            )}
          </div>
        </div>
      ) : null}

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleToastClose} severity="error" sx={{ width: '100%' }}>
          {err}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Import;
