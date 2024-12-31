import { useContext, useEffect, useRef, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import usePassword from "../hooks/usePassword";
import { AccountContext } from "../context/AccountProvider";
import Mnemonics from "./Mnemonics";

const ShowMnemonics = ({
  isModalOpen,
  closeModal,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<"error" | "success">(
    "error"
  );
  const passRef = useRef<HTMLInputElement>(null);
  const { verifyPassword, error, data } = usePassword();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPhrase, setShowPhrase] = useState<boolean>(false);
  const { mnemonic } = useContext(AccountContext);
  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setToastMessage(error);
      setToastSeverity("error");
      setToastOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      const phrase = mnemonic.split(" ");
      setMnemonics(phrase);
      setShowPhrase(true);
      setToastMessage("Password verified successfully!");
      setToastSeverity("success");
      setToastOpen(true);
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

  const handleClose = () => {
    setShowPhrase(false);
    closeModal();
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center font-[Poppins] items-center">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-[400px]">
            {!showPhrase ? (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded shadow-lg"
              >
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Password</label>
                  <input
                    ref={passRef}
                    type="password"
                    className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Enter password"
                  />
                </div>
                {!isLoading && (
                  <button
                    type="submit"
                    className="w-full bg-gray-700 text-white p-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Submit
                  </button>
                )}
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Secret Recovery Phrase:
                </h3>
                <div className="p-2 flex flex-wrap justify-evenly">
                  {mnemonics &&
                    mnemonics.length > 0 &&
                    mnemonics.map((key, index) => (
                      <Mnemonics key={index} text={key} />
                    ))}
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={handleClose}
                    className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShowMnemonics;
