import Details from "../components/Details";
import VerifyPassword from "../components/VerifyPassword";
import { AccountContext } from "../context/AccountProvider";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const { account, keyPairmap } = useContext(AccountContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSolSecret, setShowSolSecret] = useState(false);
  const [showEthSecret, setShowEthSecret] = useState(false);
  const [currentKeyType, setCurrentKeyType] = useState<string>('');

  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const verification = (verified: boolean) => {
    if (verified) {
      if(currentKeyType === "solana") {
        setShowSolSecret(true);
      } else {
        setShowEthSecret(true);
      }
    }
    setIsModalOpen(false);
  };

  const handleShowModal = (keyType: string) => {
    if(currentKeyType === "solana" && showSolSecret) {
      setShowSolSecret(false);
      return;
    } 
    if(currentKeyType === "ethereum" && showEthSecret) {
      setShowEthSecret(false);
      return;
    }
    setCurrentKeyType(keyType);
    setIsModalOpen(true);
  };

  const solanaPublicKey = keyPairmap.get(account)?.second.second || "";
  const ethereumPublicKey = keyPairmap.get(account)?.first.second || "";
  const solanaSecretKey = keyPairmap.get(account)?.second.first || "";
  const ethereumSecretKey = keyPairmap.get(account)?.first.first || "";

  return (
    <div className="h-[91vh] w-full flex justify-center items-center space-x-[10vw] bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white font-[Poppins] p-4">
      <AnimatePresence mode="wait">
        {account ? (
          <div className="flex space-x-8">
            <motion.div
              key="solana-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 w-[32vw]"
            >
            <img
              src="https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png&fit=cover&width=192&height=192"
              alt="Solana Logo"
              className="w-16 h-16 rounded-full shadow-lg mb-4"
            />
              <Details
                publicKey={solanaPublicKey}
                privateKey={solanaSecretKey}
                onShowModal={() => handleShowModal("solana")}
                showSecret={showSolSecret}
              />
            </motion.div>

            <motion.div
              key="ethereum-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 w-[32vw]"
            >
            <img
              src="https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Ftrustwallet%2Fassets%40master%2Fblockchains%2Fethereum%2Fassets%2F0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2%2Flogo.png&fit=cover&width=192&height=192"
              alt="Ethereum Logo"
              className="w-16 h-16 rounded-full shadow-lg mb-4"
            />
              <Details
                publicKey={ethereumPublicKey}
                privateKey={ethereumSecretKey}
                onShowModal={() => handleShowModal("ethereum")}
                showSecret={showEthSecret}
              />
            </motion.div>
          </div>
        ) : (
          <motion.p
            key="no-account"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400 text-lg"
          >
            No account selected
          </motion.p>
        )}
      </AnimatePresence>

      <VerifyPassword
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        verification={verification}
      />
    </div>
  );
};

export default Dashboard;
