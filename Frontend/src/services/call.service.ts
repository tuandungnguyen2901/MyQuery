import axiosWallet from "@/utils/axiosWallet";

export const createCall = async (payload: any) => {
  try {
    const response = await axiosWallet.post(`/api/call/create-call`, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getCall = async (id: string) => {
  try {
    const response = await axiosWallet.get(`/api/chat/get-user/${id}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
