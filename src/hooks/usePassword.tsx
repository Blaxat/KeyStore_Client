import { useState } from 'react';
import axios from 'axios';

interface Message {
    message: string | null
}

interface UseDetailsReturn {
  verifyPassword: (token: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  data: Message | null;
}

const usePassword = (): UseDetailsReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Message | null>(null);

  const verifyPassword = async (token: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
        const response = await axios.post<Message>(`${import.meta.env.VITE_API_URL}/api/accounts/verify`, 
            {
                password: password
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

  return { verifyPassword, isLoading, error, data };
};

export default usePassword;
