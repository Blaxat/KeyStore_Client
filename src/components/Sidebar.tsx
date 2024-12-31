import { useContext, useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";
import { AccountContext } from "../context/AccountProvider";
import useAddAccount from "../hooks/useAddAccount";
import useDeleteAccount from "../hooks/useDeleteAccount";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface GeneratedAccount {
  accountName: string;
  keypairMapEntry: {
    first: { first: string; second: string };
    second: { first: string; second: string };
  };
  newAccounts: string[];
}

const Sidebar = () => {
  const {
    accounts,
    setAccounts,
    account,
    setAccount,
    keyPairmap,
    setKeypairmap,
    mnemonic,
    detailsLoading
  } = useContext(AccountContext);
  const { addAccount, isLoading, error, data } = useAddAccount();
  const { deleteAccount, delLoading, delError, delData } = useDeleteAccount();
  const [generatedAccount, setGeneratedAccount] = useState<GeneratedAccount | null>(null);
  const [ removing, setRemoving] = useState<boolean>(false);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('Sidebar:',detailsLoading);
  }, [detailsLoading]);

  const removeAccount = async () => {
    if (account !== "") {
      setRemoving(true);
      await deleteAccount(token, keyPairmap.get(account)?.first.first || "");
    }
  };
  
  useEffect(() => {
    if (delData) {
      const updatedAccounts = accounts.filter((item) => item !== account);
      const updatedKeyPairs = new Map(keyPairmap);
      updatedKeyPairs.delete(account);
      setKeypairmap(updatedKeyPairs);
      setAccounts(updatedAccounts);
      setAccount("");
      setRemoving(false);
    }
  }, [delData]);
  
  useEffect(() => {
    if (delError) {
      alert(delError);
    }
  }, [delError]);
  

  const generateKeypair = async () => {
    let len = 1;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i] !== `Account ${len}`) break;
      len++;
    }
  
    const newAccounts = [...accounts, `Account ${len}`].sort((a, b) => {
      const numA = parseInt(a.split(" ")[1]);
      const numB = parseInt(b.split(" ")[1]);
      return numA - numB;
    });
  
    const seed = await mnemonicToSeed(mnemonic);
    const currentIndex = len - 1;
  
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
  
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
  
    const newAccountData: GeneratedAccount = {
      accountName: `Account ${len}`,
      keypairMapEntry: {
        first: { first: privateKey, second: wallet.address },
        second: { first: Buffer.from(secret).toString("hex"), second: keypair.publicKey.toString() },
      },
      newAccounts,
    };
  
    setGeneratedAccount(newAccountData);
  
    await addAccount(
      token,
      keypair.publicKey.toString(),
      wallet.address,
      Buffer.from(secret).toString("hex"),
      privateKey,
      `Account ${len}`
    );
  };
  
  useEffect(() => {
    if (data && generatedAccount) {
      const updatedKeyPairs = new Map(keyPairmap);
      updatedKeyPairs.set(generatedAccount.accountName, generatedAccount.keypairMapEntry);
      console.log(updatedKeyPairs, generatedAccount.newAccounts);
      setKeypairmap(updatedKeyPairs);
      setAccounts(generatedAccount.newAccounts);
      setGeneratedAccount(null);
    }
  }, [data, generatedAccount]);
  
  
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);
  

  return (
    <div className="h-screen max-h-screen flex flex-col bg-gradient-to-b from-gray-800 via-gray-900 to-black shadow-lg text-white font-[Poppins]">
      <div
        className={`flex-grow overflow-y-auto ${
          accounts.length > 0 ? "p-4" : "flex items-center justify-center"
        }`}
      >
        {accounts.length > 0 ? (
          <div className="flex flex-col gap-2 w-full">
            {accounts.map((key, index) => (
              <button
                onClick={() => setAccount(key)}
                key={index}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  account === key
                    ? "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white border border-gray-500 shadow-md"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600 shadow-sm"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">No Active Accounts</span>
        )}
      </div>
      <div className="h-[10%] p-4 flex items-center justify-between bg-gradient-to-t from-gray-700 via-gray-800 to-black shadow-inner">
  <div className="flex items-center justify-center w-full">
    {account !== "" && !detailsLoading && (
      <button
        onClick={removeAccount}
        disabled={delLoading || removing}
        className="p-2 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105 mr-2"
      >
        <DeleteIcon />
      </button>
    )}
    {!detailsLoading && (
      <button
        onClick={generateKeypair}
        disabled={isLoading || generatedAccount !== null}
        className="p-2 rounded-lg hover:bg-gray-600"
      >
        <AddIcon />
      </button>
    )}
  </div>
</div>
    </div>
  );
};

export default Sidebar;
