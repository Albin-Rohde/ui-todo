import axios from 'axios';
import { useState } from 'react';

import { RestResponse } from '../types';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const sendRequest = async <T = undefined>(path: string, method: Method, body?: any): Promise<RestResponse<T | undefined>> => {
    setLoading(true);
    try {
      const { data } = await axios<RestResponse<T>>({
        url: baseUrl + path,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        data: body
      });
      setLoading(false);
      return data;
    } catch (error) {
      setError(true);
      setLoading(false);
    }
    return { ok: false, data: undefined };
  };
  return { loading, error, sendRequest };
};

export default useHttp;
