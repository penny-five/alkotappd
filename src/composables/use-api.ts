import { ApiClient } from '../clients/api';

export const useApi = () => {
  const api = new ApiClient();
  return { api };
};
