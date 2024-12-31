import { useState } from 'react';
import axios from 'axios';

interface Message {
  message: string | null
}

interface returnDetails {
  addAccount: (token: string | null, solanaPublicKey: string, ethereumPublicKey: string, solanaSecretKey: string, ethereumSecretKey: string, account: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  data: Message | null;
}

const useAddAccount = (): returnDetails => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Message | null>(null);

  const addAccount = async (token: string | null, solanaPublicKey: string, ethereumPublicKey: string, solanaSecretKey: string, ethereumSecretKey: string, account: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
        const response = await axios.post<Message>(`${import.meta.env.VITE_API_URL}/api/accounts/add`,
            {
              eth_private_key: ethereumSecretKey,
              eth_public_key: ethereumPublicKey, 
              sol_private_key: solanaSecretKey,
              sol_public_key: solanaPublicKey,
              name: account, 
            }, {
              headers: {
                token: token
              },
            }
        );
        setData(response.data);
    } catch (err: any) {
      if (err.response) {
        if(err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        }
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { addAccount, isLoading, error, data };
};

export default useAddAccount;
