import type { LayoutDTO } from '@/models/dtos/LayoutDTO';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


// Configurazione axios con JWT (se usi autenticazione)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const layoutApi = {
  /**
   * Ottiene il layout dell'utente
   */
  async getLayout(layoutName: string = 'default'): Promise<LayoutDTO> {
    const response = await apiClient.get<LayoutDTO>(`/api/layouts`, {
      params: { name: layoutName },
    });
    return response.data;
  },

  /**
   * Ottiene tutti i layout dell'utente
   */
  async getAllLayouts(): Promise<LayoutDTO[]> {
    const response = await apiClient.get<LayoutDTO[]>(`/api/layouts/all`);
    return response.data;
  },

  /**
   * Salva il layout
   */
  async saveLayout(layoutDTO: LayoutDTO): Promise<LayoutDTO> {
    const response = await apiClient.post<LayoutDTO>(`/api/layouts`, layoutDTO);
    return response.data;
  },

  /**
   * Aggiorna il layout
   */
  async updateLayout(layoutDTO: LayoutDTO): Promise<LayoutDTO> {
    const response = await apiClient.put<LayoutDTO>(`/api/layouts`, layoutDTO);
    return response.data;
  },

  /**
   * Elimina un layout
   */
  async deleteLayout(layoutName: string): Promise<void> {
    await apiClient.delete(`/api/layouts/${layoutName}`);
  },

  /**
   * Resetta al layout di default
   */
  async resetLayout(): Promise<LayoutDTO> {
    const response = await apiClient.post<LayoutDTO>(`/api/layouts/reset`);
    return response.data;
  },
};
