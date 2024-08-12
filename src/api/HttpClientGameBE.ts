import { HttpClient } from "./httpClient";
import * as config from "config";

const HttpClientGameBE = new HttpClient({
  baseURL: config.SETTINGS.BLOCKCHAIN_BE_URL,
});

export default HttpClientGameBE;
