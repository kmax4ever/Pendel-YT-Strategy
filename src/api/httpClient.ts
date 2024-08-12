import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import _ from "lodash";
var qs = require("qs");

export class HttpClient {
  private _agent: AxiosInstance;

  public constructor(options?: AxiosRequestConfig) {
    this._agent = axios.create(options);

    this._agent.interceptors.response.use((response: any) => ({
      ...response,
      data: response.data,
    }));
  }

  public get = async (url: string, params: object = {}) => {
    try {
      const response = await this._agent.get(url, {
        params,
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        },
      });
      return response;
    } catch (err) {
      if (err.response) {
        throw err.response;
      } else {
        throw err;
      }
    }
  };

  public post = async (url: string, data: object = {}) => {
    try {
      const response = await this._agent.post(url, data);
      return response;
    } catch (err) {
      if (err.response) {
        throw err.response;
      } else {
        throw err;
      }
    }
  };

  public put = async (url: string, data: object = {}) => {
    try {
      const response = await this._agent.put(url, data);
      return response;
    } catch (err) {
      if (err.response) {
        throw err.response;
      } else {
        throw err;
      }
    }
  };

  public patch = async (url: string, data: object = {}) => {
    try {
      const response = await this._agent.patch(url, data);
      return response;
    } catch (err) {
      if (err.response) {
        throw err.response;
      } else {
        throw err;
      }
    }
  };

  public delete = async (url: string, data: object = {}) => {
    try {
      const response = await this._agent.delete(url, data);
      return response;
    } catch (err) {
      if (err.response) {
        throw err.response;
      } else {
        throw err;
      }
    }
  };

  public setBaseURL = (url: string) => {
    this._agent.defaults.baseURL = url;
  };

  public setBearerToken = (token: string) => {
    this._agent.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  public static buildParams = (obj: any) => {
    const res = [];
    if (_.isObject(obj)) {
      for (const k in obj) {
        let val = obj[k];
        if (val === undefined || val === null) {
          val = "";
        }
        if (_.isArray(val)) {
          val = val.join(",");
        }
        res.push(`${k}=${val}`);
      }
    }
    return res.length > 0 ? `${res.join("&")}` : "";
  };
}
