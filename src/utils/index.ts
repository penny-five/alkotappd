import { Store } from '../clients/api';

export const createStoreSlug = (store: Store) => {
  return store.name.toLowerCase().replaceAll(' ', '-');
};
