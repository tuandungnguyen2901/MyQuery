import axiosClient from "@/utils/axiosClient";
import axiosWallet from "@/utils/axiosWallet";

export const sendMessage = async () => {
  const res = await axiosClient.post("");
};

export const createUserOnStream = async (id: string) => {
  try {
    const payload = { userId: id };
    const response = await axiosWallet.post(`/api/chat/create-user`, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getUserOnStream = async (username: string) => {
  try {
    const payload = { username: username };
    const response = await axiosWallet.post(`/api/chat/get-user`, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
