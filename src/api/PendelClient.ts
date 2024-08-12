import { HttpClient } from "./httpClient";
import * as config from "config";

const HttpClientPendelBE = new HttpClient({
  baseURL: config.SETTINGS.PENDEL_URL,
});

export default HttpClientPendelBE;
