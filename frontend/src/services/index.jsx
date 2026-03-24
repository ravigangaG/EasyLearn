import api from './api.jsx';

// Auth services
export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/password', data)
};

// Resource services
export const resourceService = {
    getAll: (params) => api.get('/resources', { params }),
    getById: (id) => api.get(`/resources/${id}`),
    create: (formData) => api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/resources/${id}`, data),
    delete: (id) => api.delete(`/resources/${id}`),
    rate: (id, data) => api.post(`/resources/${id}/rate`, data),
    bookmark: (id) => api.post(`/resources/${id}/bookmark`),
    download: (id) => api.get(`/resources/${id}/download`)
};

// Question services
export const questionService = {
    getAll: (params) => api.get('/questions', { params }),
    getById: (id) => api.get(`/questions/${id}`),
    create: (data) => api.post('/questions', data),
    update: (id, data) => api.put(`/questions/${id}`, data),
    delete: (id) => api.delete(`/questions/${id}`),
    vote: (id, voteType) => api.put(`/questions/${id}/vote`, { voteType }),
    postAnswer: (id, content) => api.post(`/questions/${id}/answers`, { content }),
    voteAnswer: (questionId, answerId, voteType) =>
        api.put(`/questions/${questionId}/answers/${answerId}/vote`, { voteType }),
    acceptAnswer: (questionId, answerId) =>
        api.put(`/questions/${questionId}/answers/${answerId}/accept`),
    bookmark: (id) => api.post(`/questions/${id}/bookmark`)
};

// Discussion services
export const discussionService = {
    getAll: (params) => api.get('/discussions', { params }),
    getById: (id) => api.get(`/discussions/${id}`),
    create: (data) => api.post('/discussions', data),
    update: (id, data) => api.put(`/discussions/${id}`, data),
    delete: (id) => api.delete(`/discussions/${id}`),
    reply: (id, content) => api.post(`/discussions/${id}/replies`, { content }),
    like: (id) => api.put(`/discussions/${id}/like`),
    likeReply: (discussionId, replyId) =>
        api.put(`/discussions/${discussionId}/replies/${replyId}/like`)
};

// User services
export const userService = {
    getProfile: (id) => api.get(`/users/${id}`),
    getResources: (id) => api.get(`/users/${id}/resources`),
    getQuestions: (id) => api.get(`/users/${id}/questions`),
    updateProfile: (data) => api.put('/auth/profile', data),
    bookmarkResource: (resourceId) => api.post(`/users/bookmark/resource/${resourceId}`),
    unbookmarkResource: (resourceId) => api.delete(`/users/bookmark/resource/${resourceId}`),
    getBookmarkedResources: () => api.get('/users/bookmarks/resources')
};
