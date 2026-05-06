import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Configure axios to include credentials and handle errors better
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/users/`, { email, password });
  return response.data;
};

// Session Management APIs
export const createSession = async (title, userId) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('user_id', userId);

  const response = await axios.post(`${API_BASE_URL}/sessions`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
  return response.data;
};

export const getUserSessions = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/sessions/${userId}`);
  return response.data;
};

export const getSessionDetail = async (sessionId) => {
  const response = await axios.get(`${API_BASE_URL}/sessions/detail/${sessionId}`);
  return response.data;
};

export const updateSession = async (sessionId, title) => {
  const response = await axios.put(`${API_BASE_URL}/sessions/${sessionId}`, { title });
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await axios.delete(`${API_BASE_URL}/sessions/${sessionId}`);
  return response.data;
};

export const generateFlashcards = async (pdfFilesArray, numarIntrebari, sessionId, userId) => {
  const formData = new FormData();
  
  pdfFilesArray.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('numar_intrebari', numarIntrebari);
  formData.append('session_id', sessionId);
  formData.append('user_id', userId);

  console.log('Uploading to:', `${API_BASE_URL}/upload`);
  console.log('Session ID:', sessionId, 'User ID:', userId);

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const evaluateAnswer = async (raspuns_corect, raspuns_utilizator, severitate = 2) => {
  const params = new URLSearchParams({
    intrebare_id: 0,
    raspuns_utilizator,
    raspuns_corect,
    severitate,
  });

  const response = await axios.post(`${API_BASE_URL}/evaluate?${params.toString()}`);
  return response.data;
};