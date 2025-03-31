import dotenv from 'dotenv';
dotenv.config();

export const config = {
  sui: {
    privateKey: process.env.SUI_PRIVATE_KEY || '',
  },
};
