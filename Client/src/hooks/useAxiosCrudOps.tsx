import { useState, useEffect } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";

interface IAxiosConfigProps {
  axiosInstance?: AxiosInstance;
  method: Method;
  url: string;
  requestConfig?: AxiosRequestConfig | IBooksProps;
}

export interface IBooksProps {
  id?: number;
  title: string;
  author: string;
  genre: string;
  description: string;
}

// setting the return type
const useAxiosCrudOps = (): [
  IBooksProps[],
  string,
  boolean,
  (configObj: IAxiosConfigProps) => Promise<void>
] => {
  const [response, setResponse] = useState<IBooksProps[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [controller, setController] = useState<AbortController | any>();

  const axiosFetch = async (configObj: IAxiosConfigProps) => {
    const { axiosInstance, method, url, requestConfig = {} } = configObj;

    try {
      setLoading(true);
      setError("");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const ctrl = new AbortController();
      setController(ctrl);
      const configWithSignal = {
        ...requestConfig,
        signal: ctrl.signal,
      };
      let res;
      switch (method.toLowerCase()) {
        case "get":
          res = await axiosInstance?.get(url, configWithSignal);
          break;
        case "put":
          res = await axiosInstance?.put(url, configWithSignal);
          break;
        case "post":
          res = await axiosInstance?.post(url, configWithSignal);
          break;
        case "delete":
          res = await axiosInstance?.delete(url, configWithSignal);
          break;
        default:
          throw new Error(`Error: ${method} method name is not supported`);
      }
      //   console.log("Response: ", res);
      setResponse(res?.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request was cancelled", err.message);
      } else if (axios.isAxiosError(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => controller && controller.abort();
  }, [controller]);

  return [response, error, loading, axiosFetch];
};

export default useAxiosCrudOps;
