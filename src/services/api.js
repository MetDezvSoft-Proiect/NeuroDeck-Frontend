import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const generateFlashcards = async (pdfFile) => {
  const formData = new FormData();
  formData.append('file', pdfFile); // Numele 'file' trebuie să coincidă cu cel din FastAPI

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};