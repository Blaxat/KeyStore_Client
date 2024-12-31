import { useState } from 'react';
import axios from 'axios';

interface Message {
  message: string | null
}

interface returnDetails {
  deleteAccount: (token: string | null, ethereumSecretKey: string) => Promise<void>;
  delLoading: boolean;
  delError: string | null;
  delData: Message | null;
}

const useDeleteAccount = (): returnDetails => {
  const [delLoading, setIsLoading] = useState<boolean>(false);
  const [delError, setError] = useState<string | null>(null);
  const [delData, setData] = useState<Message | null>(null);

  const deleteAccount = async (token: string | null, ethereumSecretKey: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
        const response = await axios.post<Message>(`${import.meta.env.VITE_API_URL}/api/accounts/delete`,
            {
              eth_private_key: ethereumSecretKey,
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

  return { deleteAccount, delLoading, delError, delData };
};

export default useDeleteAccount;
