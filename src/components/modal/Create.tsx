import { generateMnemonic } from "bip39";
import { useEffect, useState } from "react";
import Mnemonics from "../Mnemonics";
import Password from "../Password";
import useCreateWallet from "../../hooks/useCreateWallet";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Create = ({
  isModalOpen,
  closeModal,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const [renderForm, setRenderForm] = useState<boolean>(false);
  const [words24, setWords24] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [mnemonicPhrase, setmnemonicPhrase] = useState<string>('');
  const { createWallet, isLoading, error, data } = useCreateWallet();
  const [err, setErr] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mnemonicPhrase && password) {
      createWallet(mnemonicPhrase, password, true); 
    }
  }, [mnemonicPhrase, password]); 

  useEffect(() => {
    if (error) {
      setErr(error);
      setToastOpen(true); // Open toast when error exists
      console.log(error);
    }
  }, [error]);
  
  useEffect(() => {
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    }
  }, [data]);

  useEffect(() => {
    if (isModalOpen) {
      const mnemonic = generateMnemonic(words24 ? 256 : 128).split(" ");
      setMnemonics(mnemonic);
      setRenderForm(false);
    }
  }, [isModalOpen, words24]);

  const copyToClipboard = () => {
    const seedString = mnemonics.join(" ");
    navigator.clipboard
      .writeText(seedString)
      .then(() => {
        setmnemonicPhrase(seedString);
        setRenderForm(true);
      })
      .catch(() => alert("Failed to copy seed!"));
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center font-[Poppins] items-center">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-[400px]">
            {!renderForm ? (
              <>
                <div className="p-2 flex flex-wrap justify-evenly">
                  {mnemonics &&
                    mnemonics.length > 0 &&
                    mnemonics.map((key, index) => (
                      <Mnemonics key={index} text={key} />
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
                <div className="flex items-center justify-center text-sm mt-4">
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={copyToClipboard}
                  >
                    Copy Secret Recovery Phrase
                  </button>
                </div>
              </>
            ) : (
              <Password loading={isLoading} err={error} getPassword={(value) => setPassword(value)}/>
            )}
          </div>
        </div>
      )}
      
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

export default Create;
