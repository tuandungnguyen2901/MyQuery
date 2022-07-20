import axiosClient from '@/utils/axiosClient';

export const getAllTutors = async () => {
  const res = await axiosClient.get('/web/instructor/all');

  return res;
};

export async function updateTutor(data: any, token: string) {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axiosClient.put(
      `/web/instructor/edit`,
      data,
      config
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
}

export const getUserById = async (userId: string) => {
  const res = await axiosClient.get('/web/users/read', {
    params: { user_id: userId },
  });

  return res;
};

export const addTagsToInstructor = async (data: any, token: any) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axiosClient.post('/web/tags/tag_instructor', data, config);

  return res;
};
