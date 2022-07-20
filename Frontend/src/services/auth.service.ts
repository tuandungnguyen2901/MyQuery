import axiosClient from '@/utils/axiosClient';

export async function login(user: any) {
  try {
    // console.log(user);
    const response = await axiosClient.post(`/web/login`, JSON.stringify(user));
    return response;
  } catch (e: any) {
    return e.response;
  }
}

export async function signUp(user: any) {
  try {
    const response = await axiosClient.post(
      `/web/users/add`,
      JSON.stringify(user)
    );
    return response;
  } catch (e: any) {
    return e.response;
  }
}

export async function getUser(id: string) {
  try {
    const response = await axiosClient.get(`/web/users/read`, {
      params: { user_id: id },
    });
    return response;
  } catch (error: any) {
    return error.response;
  }
}

export async function updateUser(data: any, token: string) {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axiosClient.put(`/web/users/edit`, data, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
}
