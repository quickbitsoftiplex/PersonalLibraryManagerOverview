import { useState, useEffect } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";

interface IAxiosConfigProps {
  axiosInstance?: AxiosInstance;
  method: Method;
  url: string;
  requestConfig?: AxiosRequestConfig;
}

const useAxios = (configObj: IAxiosConfigProps) => {
  const { axiosInstance, method, url, requestConfig = {} } = configObj;

  const [response, setResponse] = useState([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);

  const refetch = () => {
    setReload((prev) => prev + 1);
  };

  useEffect(() => {
    // aborts the request
    // prevents a memory leak
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        // TS does not allow dynamic access to
        // properties or methods w/o explicit index that's why I switched based on metod
        // const res = await axiosInstance[method.toLowerCase()](url, {
        //   ...requestConfig,
        //   signal: controller.signal,
        // });

        const configWithSignal = {
          ...requestConfig,
          signal: controller.signal,
        };
        let res;
        switch (method.toLowerCase()) {
          case "get":
            res = await axiosInstance?.get(url, configWithSignal);
            break;
          case "post":
            res = await axiosInstance?.post(url, configWithSignal);
            break;
          case "delete":
            res = await axiosInstance?.get(url, configWithSignal);
            break;
          default:
            throw new Error(`Error: ${method} method name is not supported`);
        }
        console.log("Response: ", res);
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

    fetchData();

    // cleanup
    return () => controller.abort();
  }, [reload]);

  return [response, error, loading, refetch];
};

export default useAxios;
