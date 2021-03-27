import { AlkoProductPackaging } from './types';

export const sanitizeProductName = (productName: string) => {
  if (productName.endsWith(' tölkki')) {
    return productName.substr(0, productName.length - ' tölkki'.length);
  }
  return productName;
};

export const getPackagingType = (productName: string) => {
  if (productName.match(/.*\d?\d-pack$/)) {
    return AlkoProductPackaging.MULTIPACK;
  }

  return AlkoProductPackaging.SINGLE;
};
