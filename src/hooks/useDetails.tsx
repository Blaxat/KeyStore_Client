import { useState } from 'react';
import axios from 'axios';

interface details {
  keyPair: Record<string, any>,
  secretPhrase: string,
  accounts: string[],
  mnemonics: string;
}

interface UseDetailsReturn {
  getDetails: (token: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  data: details | null;
}

const useDetails = (): UseDetailsReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<details | null>(null);


  const getDetails = async (token: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
        const response = await axios.get<details>(`${import.meta.env.VITE_API_URL}/api/accounts/get`, {
            headers: {
                token: token
            }
        });
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

  return { getDetails, isLoading, error, data };
};

export default useDetails;
