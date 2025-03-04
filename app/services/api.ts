import { Project, Category, TimeEntry } from '../types';

const API_URL = 'https://api.timetracker.com/v1'; // Örnek API URL'i

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Projects
  async syncProjects(projects: Project[]): Promise<Project[]> {
    return this.request<Project[]>('/projects/sync', {
      method: 'POST',
      body: JSON.stringify(projects),
    });
  }

  // Categories
  async syncCategories(categories: Category[]): Promise<Category[]> {
    return this.request<Category[]>('/categories/sync', {
      method: 'POST',
      body: JSON.stringify(categories),
    });
  }

  // Time Entries
  async syncTimeEntries(timeEntries: TimeEntry[]): Promise<TimeEntry[]> {
    return this.request<TimeEntry[]>('/time-entries/sync', {
      method: 'POST',
      body: JSON.stringify(timeEntries),
    });
  }

  // Full Sync
  async syncAll(data: {
    projects: Project[];
    categories: Category[];
    timeEntries: TimeEntry[];
  }): Promise<{
    projects: Project[];
    categories: Category[];
    timeEntries: TimeEntry[];
  }> {
    return this.request('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService; 