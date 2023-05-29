import axios from 'axios';
import { useState } from 'react';

import { RestResponse } from '../types';

const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

interface SendRequestParams {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const sendRequest = async <T = undefined>(params: SendRequestParams): Promise<RestResponse<T | undefined>> => {
    setLoading(true);
    try {
      const { data } = await axios<RestResponse<T>>({
        withCredentials: true,
        url: baseUrl + params.path,
        method: params.method,
        headers: {
          'Content-Type': 'application/json',
        },
        data: params.body || {},
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
