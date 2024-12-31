import { useState } from 'react';
import axios from 'axios';

interface CreateWalletResponse {
  message: string;
  token: string;
}

interface UseCreateUserReturn {
  createWallet: (phrase: string, password: string, type: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  data: CreateWalletResponse | null;
}

const useCreateWallet = (): UseCreateUserReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CreateWalletResponse | null>(null);

  const createWallet = async (phrase: string, password: string, type: boolean): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      if(type) {
        const response = await axios.post<CreateWalletResponse>(`${import.meta.env.VITE_API_URL}/api/wallet/create`, { phrase, password });
        console.log(response.data);
        setData(response.data);
      } else {
        const response = await axios.post<CreateWalletResponse>(`${import.meta.env.VITE_API_URL}/api/wallet/verify`, { phrase, password });
        setData(response.data);
        setData(response.data);
      }

    } catch (err: any) {
      if (err.response) {
        if (Array.isArray(err.response.data.errors)) {
          const errorMessage = err.response.data.errors.map((e: any) => e.message).join('. ');
          setError(errorMessage);
        } 
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError(err.message);
      }
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { createWallet, isLoading, error, data };
};

export default useCreateWallet;
