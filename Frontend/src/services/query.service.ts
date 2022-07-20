import axiosClient from '@/utils/axiosClient';

export const getAllTags = async () => {
  const res = await axiosClient.get('/web/tags/all');

  return res;
};

export const getAllPosts = async () => {
  const res = await axiosClient.get('/web/posts/all');

  return res;
};

export const createNewQuery = async (data: any, token: string) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axiosClient.post(`/web/posts/add`, data, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const searchQuery = async (data: {
  search_str: string[] | null;
  filter_tags: string[] | null;
}) => {
  try {
    const response = await axiosClient.post(`/web/posts/search_post`, data);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const addTagToQuery = async (data: any, token: any) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axiosClient.post(`/web/tags/tag-post`, data, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const searchQueryById = async (id: string) => {
  try {
    const response = await axiosClient.get(`/web/posts/read`, {
      params: { post_id: id },
    });

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getQueriesByUserId = async (userId: string) => {
  try {
    const response = await axiosClient.get(`/web/posts/by-user`, {
      params: { user_id: userId },
    });

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const pushUpVote = async (postId: string, token: string) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const body = {
      post_id: postId,
    };

    const response = await axiosClient.post(`/web/posts/upvote`, body, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const pushDownVote = async (postId: string, token: string) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const body = {
      post_id: postId,
    };

    const response = await axiosClient.post(
      `/web/posts/downvote`,
      body,
      config
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const updateQuery = async (data: any, token: any) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axiosClient.put(`/web/posts/edit`, data, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getAllCommentByPost = async (postId: string) => {
  try {
    const config = {
      params: { post_id: postId },
    };

    const response = await axiosClient.get(`/web/comments/by-post`, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const addComment = async (body: any, token: any) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axiosClient.post(`/web/comments/add`, body, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getCommentInfoById = async (commentId: string) => {
  try {
    const config = {
      params: { comment_id: commentId },
    };

    const response = await axiosClient.get(`/web/comments/read`, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const pushCommentUpVote = async (commentId: string, token: any) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const body = {
      comment_id: commentId,
    };

    const response = await axiosClient.post(
      `/web/comments/upvote`,
      body,
      config
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const pushCommentDownVote = async (commentId: string, token: any) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const body = {
      comment_id: commentId,
    };

    const response = await axiosClient.post(
      `/web/comments/downvote`,
      body,
      config
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const saveQuery = async (postId: string, token: string) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const body = {
      post_id: postId,
    };

    const response = await axiosClient.post(`/web/posts/save`, body, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getAllSavedPosts = async (token: string) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axiosClient.get(`/web/posts/all-saved`, config);

    return response;
  } catch (error: any) {
    return error.response;
  }
};
