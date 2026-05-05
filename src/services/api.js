import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const generateFlashcards = async (pdfFile) => {
  const formData = new FormData();
  formData.append('file', pdfFile);

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
  return response.data; // { scor, status }
};
