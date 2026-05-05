import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data;
};

export const registerUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/users/`, { email, password });
  return response.data;
};

export const generateFlashcards = async (pdfFilesArray, numarIntrebari) => {
  const formData = new FormData();
  
  // Atașăm fiecare PDF la formular (FastAPI le va prinde ca o listă)
  pdfFilesArray.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('numar_intrebari', numarIntrebari);

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