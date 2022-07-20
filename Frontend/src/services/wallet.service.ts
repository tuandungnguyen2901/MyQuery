import axiosWallet from '@/utils/axiosWallet';

export const getUserBalance = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axiosWallet.get('/api/ewallet/userWallet', config);
  return res;
};

export const createWallet = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axiosWallet.post('/api/ewallet/userWallet', {}, config);

  return res;
};

export const increaseMoney = async (
  amount: { amount: number },
  token: string
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axiosWallet.post(
    '/api/ewallet/userWallet/charge',
    amount,
    config
  );

  return res;
};

export const withdrawMoney = async (
  amount: { amount: number },
  token: string
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axiosWallet.post(
    '/api/ewallet/userWallet/pay',
    amount,
    config
  );

  return res;
};
