import axios from 'axios';
import { useState } from 'react';

import { RestResponse } from '../types';

interface SendRequestParams {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const apiUrl = process.env.REACT_APP_BACKEND_URL || '';

  const sendRequest = async <T = undefined>(params: SendRequestParams): Promise<RestResponse<T | undefined>> => {
    setLoading(true);
    try {
      const { data } = await axios<RestResponse<T>>({
        withCredentials: true,
        url: apiUrl + '/api' + params.path,
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
