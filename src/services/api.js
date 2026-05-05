import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const generateFlashcards = async (pdfFile) => {
  const formData = new FormData();
  formData.append('file', pdfFile);

  try {
    console.log('📤 Trimit PDF la backend:', pdfFile.name);
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Răspuns de la backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Eroare la conectare backend:', error.response?.data || error.message);
    throw error;
  }
};