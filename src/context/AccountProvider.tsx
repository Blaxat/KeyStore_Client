import { createContext, useState, useEffect, ReactNode } from "react";
import useDetails from "../hooks/useDetails";
import { useLocation } from "react-router-dom";

interface Pair<T, U> {
  first: T;
  second: U;
}

interface AccountContextType {
  accounts: string[];
  setAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  account: string,
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  keyPairmap: Map<string, Pair<Pair<string, string>, Pair<string, string>>>;
  setKeypairmap: React.Dispatch<React.SetStateAction<Map<string, Pair<Pair<string, string>, Pair<string, string>>>>>;
  mnemonic: string;
  detailsLoading: boolean
}

const defaultContextValue: AccountContextType = {
  accounts: [],
  setAccounts: () => {},
  account: '',
  setAccount: () => {},
  keyPairmap: new Map(),
  setKeypairmap: () => {},
  mnemonic: "",
  detailsLoading: false
};

const AccountContext = createContext<AccountContextType>(defaultContextValue);

interface AccountProviderProps {
  children: ReactNode;
}

const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [keyPairmap, setKeypairmap] = useState(
    new Map<string, Pair<Pair<string, string>, Pair<string, string>>>()
  );
  const [mnemonic, setMnemonic] = useState<string>("");
  const [account, setAccount] = useState<string>('');
  const { getDetails, error, data } = useDetails();
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const location = useLocation();
  const [isDashboard, setIsDashboard] = useState<boolean>(false);

  useEffect(() => {
    console.log(location.pathname);
    if(location.pathname === "/dashboard") {
      setIsDashboard(true);
    }
  }, [location.pathname])

  useEffect(() => {
    console.log('Provider:',detailsLoading);
  }, [detailsLoading]);

  useEffect(() => {
      if (data) {
        setMnemonic(data.mnemonics);
        setAccounts(data.accounts);

        const newKeypairMap = new Map<string, Pair<Pair<string, string>, Pair<string, string>>>();
        Object.entries(data.keyPair).forEach(([name, keys]) => {
          newKeypairMap.set(
            name,
            {
              first: { first: keys.eth.privateKey, second: keys.eth.publicKey },
              second: { first: keys.sol.privateKey, second: keys.sol.publicKey }
            }
          );
        });
        setKeypairmap(newKeypairMap);
        setDetailsLoading(false);
      }
  }, [data]);

  useEffect(() => {
    if (error && error === "Phrase does not exist") {
      localStorage.removeItem('token');
      setDetailsLoading(false);
      return;
    }

    if(error) { 
      console.log(error);
      setDetailsLoading(false);
      return;
    }
  }, [error]);

  useEffect(() => {
    if(isDashboard) {
      const token = localStorage.getItem('token');

      const fetchDetails = async () => {
        if (token) {
          setDetailsLoading(true);
          await getDetails(token);
        }
      };
  
      fetchDetails();
    }
  }, [isDashboard]); 

  return (
    <AccountContext.Provider
      value={{
        accounts,
        setAccounts,
        account,
        setAccount,
        keyPairmap,
        setKeypairmap,
        mnemonic,
        detailsLoading
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountProvider, AccountContext };
