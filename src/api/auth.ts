import HttpClientGameBE from "./HttpClientGameBE";

export const login = async (body: { email: string; password: string }) => {
  return await HttpClientGameBE.post(`/api/users/login`, body);
};

export const getSystemParams = async () => {
  return await HttpClientGameBE.get(`/users/getSystemParams`);
};
